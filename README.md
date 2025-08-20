# Buylist Dashboard

A comprehensive React-based dashboard for managing game store buylist processing with integrated Storepass and Shopify workflows.

## Features

- **Kanban-style Processing Board**: Drag and drop buylists through different processing stages
- **Multi-Platform Integration**: Ready for Storepass and Shopify API integration
- **Real-time Status Tracking**: Track buylists from submission to completion
- **Dark Mode Support**: Toggle between light and dark themes
- **Activity History**: Complete audit trail for all buylist changes
- **Search & Filter**: Find specific buylists or cards quickly
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Supported Card Games

- Magic: The Gathering
- Pokemon
- Disney Lorcana

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser
5. Click "Demo Login" to explore the dashboard

## Project Structure

```
src/
├── components/
│   ├── Dashboard/          # Main dashboard components
│   │   ├── BuylistBoard.jsx
│   │   ├── BuylistCard.jsx
│   │   └── index.js
│   ├── Modals/            # Modal components
│   │   ├── ImportModal.jsx
│   │   └── index.js
│   └── UI/                # Reusable UI components
│       ├── LoadingSpinner.jsx
│       ├── ErrorDisplay.jsx
│       └── index.js
├── hooks/                 # Custom React hooks
│   ├── useBuylists.js
│   ├── useAuth.js
│   └── index.js
├── services/              # API service layer
│   ├── apiService.js
│   ├── storepassService.js
│   ├── shopifyService.js
│   ├── authService.js
│   └── index.js
└── utils/                 # Utility functions and constants
    ├── constants.js
    ├── helpers.js
    └── index.js
```

## API Integration

The application is architected for easy API integration:

### Storepass Integration
- Import pending buylists from Storepass
- Sync status updates back to Storepass
- Handle customer data and card submissions

### Shopify Integration
- Create products from processed buylists
- Update inventory levels
- Manage pricing data

### Authentication
- JWT-based authentication system
- Role-based permissions
- Session management

## Buylist Processing Workflow

1. **Pending Receiving**: Imported from Storepass, awaiting physical cards
2. **Received**: Physical cards received by store
3. **Authenticated**: Cards verified as authentic
4. **Checked**: Cards condition and details verified
5. **Processed**: Final pricing determined and customer notified
6. **Recently Done**: Processing completed, ready for pickup/payment
7. **Waiting for Pickup**: Customer notified, awaiting collection

## Development

### Available Scripts

- `npm start`: Start development server
- `npm build`: Build for production
- `npm test`: Run test suite

### Mock Mode

The application includes comprehensive mock data for development and testing. All service files are ready for real API integration - just uncomment the TODO sections and add your API endpoints.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License