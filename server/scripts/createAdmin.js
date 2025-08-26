const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Employee Schema (same as in server.js)
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

const Employee = mongoose.model('Employee', employeeSchema);

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/buylist-dashboard');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Employee.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.username);
      process.exit(0);
    }

    // Create admin user
    const adminData = {
      username: 'admin',
      email: 'admin@yourstore.com',
      password: 'admin123',
      name: 'System Administrator',
      role: 'admin',
      permissions: ['view_buylists', 'edit_buylists', 'process_payments', 'manage_users', 'view_reports']
    };

    const admin = await Employee.create(adminData);
    console.log('✅ Admin user created successfully!');
    console.log('Username:', admin.username);
    console.log('Password: admin123');
    console.log('⚠️  Please change the default password after first login!');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

createAdmin();