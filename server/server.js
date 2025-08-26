const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3002'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/buylist-dashboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Employee Schema
const employeeSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'manager', 'staff'],
    default: 'staff'
  },
  permissions: [{
    type: String,
    enum: ['view_buylists', 'edit_buylists', 'process_payments', 'manage_users', 'view_reports']
  }],
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now }
});

employeeSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

employeeSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Employee = mongoose.model('Employee', employeeSchema);

// Buylist Schema  
const buylistSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  submissionDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['Pending Receiving', 'Received', 'Authenticated', 'Checked', 'Processed', 'Recently Done', 'Still Waiting to Pick Up Check'],
    default: 'Pending Receiving'
  },
  totalEstimatedValue: { type: Number, required: true },
  finalValue: Number,
  lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  lastModifiedDate: { type: Date, default: Date.now },
  cards: [{
    game: String,
    cardName: String,
    set: String,
    condition: String,
    estimatedPrice: Number,
    finalPrice: Number,
    quantity: Number,
    rarity: String,
    notes: String
  }],
  activityHistory: [{
    action: String,
    status: String,
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    timestamp: { type: Date, default: Date.now },
    notes: String
  }],
  shopifyId: String,
  storepassId: String,
  notes: String,
  completedDate: Date,
  createdAt: { type: Date, default: Date.now }
});

const Buylist = mongoose.model('Buylist', buylistSchema);

// Auth middleware
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    const employee = await Employee.findById(decoded.id).select('-password');
    if (!employee || !employee.isActive) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.employee = employee;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d',
  });
};

// Authentication Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const employee = await Employee.findOne({ 
      $or: [{ username }, { email: username }],
      isActive: true 
    });

    if (!employee || !(await employee.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    employee.lastLogin = new Date();
    await employee.save();

    const token = generateToken(employee._id);

    res.json({
      token,
      employee: {
        id: employee._id,
        username: employee.username,
        email: employee.email,
        name: employee.name,
        role: employee.role,
        permissions: employee.permissions
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/profile', authMiddleware, async (req, res) => {
  try {
    res.json(req.employee);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Buylist Routes
app.get('/api/buylists', authMiddleware, async (req, res) => {
  try {
    const buylists = await Buylist.find()
      .populate('lastModifiedBy', 'name username')
      .populate('activityHistory.employee', 'name username')
      .sort({ updatedAt: -1 });

    res.json({ buylists });
  } catch (error) {
    console.error('Fetch buylists error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.patch('/api/buylists/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const buylist = await Buylist.findById(req.params.id);
    if (!buylist) {
      return res.status(404).json({ message: 'Buylist not found' });
    }

    const oldStatus = buylist.status;
    buylist.status = status;
    buylist.lastModifiedBy = req.employee._id;
    buylist.lastModifiedDate = new Date();

    buylist.activityHistory.push({
      action: `Status changed from ${oldStatus} to ${status}`,
      status: status,
      employee: req.employee._id,
      timestamp: new Date(),
      notes: notes || `Status manually changed from ${oldStatus} to ${status}`
    });

    if (status === 'Recently Done' && !buylist.completedDate) {
      buylist.completedDate = new Date();
    }

    await buylist.save();
    await buylist.populate('lastModifiedBy', 'name username');
    await buylist.populate('activityHistory.employee', 'name username');

    res.json(buylist);
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;