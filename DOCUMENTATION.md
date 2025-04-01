# TradeHeaven Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Getting Started](#getting-started)
4. [Project Structure](#project-structure)
5. [Features](#features)
6. [Technical Stack](#technical-stack)
7. [API Documentation](#api-documentation)
8. [Development Guidelines](#development-guidelines)
9. [Troubleshooting](#troubleshooting)

## Overview

TradeHeaven is a modern trading platform that provides a comprehensive solution for managing trading activities, including wallet management, collateral system, and transaction tracking. The platform is built with a focus on user experience and real-time feedback.

## Architecture

The application follows a client-server architecture:

- **Frontend**: React-based SPA with TypeScript
- **Backend**: Express.js server with SQLite database
- **State Management**: React Hooks and Context API
- **UI Components**: ShadcnUI with Tailwind CSS

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn package manager
- SQLite3

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd TradeHeaven
```

2. Install dependencies:
```bash
npm install
```

3. Start the wallet server:
```bash
node start-wallet-server.js
```

4. Start the frontend development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (frontend) and `http://localhost:3001` (wallet server).

## Project Structure

```
TradeHeaven/
├── src/                    # Source code
│   ├── components/        # React components
│   ├── server/           # Backend server code
│   └── types/            # TypeScript type definitions
├── public/               # Static assets
├── app/                  # Next.js app directory
├── marketflow-dynamics/  # Market flow related components
├── wallet.db            # SQLite database file
└── configuration files   # Various config files
```

## Features

### 1. Wallet Management
- Deposit funds
- Withdraw funds
- Real-time balance updates
- Transaction history tracking

### 2. Collateral System
- Lock funds for trading
- Release collateral
- Collateral status monitoring

### 3. Transaction History
- Detailed transaction records
- Filtering and sorting capabilities
- Export functionality

### 4. Real-time Notifications
- Transaction confirmations
- System alerts
- Status updates

## Technical Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- ShadcnUI Components
- React Query
- React Router DOM
- Recharts (Data visualization)

### Backend
- Express.js
- SQLite3
- Better-SQLite3
- CORS enabled
- Body-parser middleware

### Development Tools
- Vite
- ESLint
- TypeScript
- PostCSS
- Autoprefixer

## API Documentation

### Wallet Endpoints

#### GET /api/wallet/balance
Retrieves the current wallet balance.

#### POST /api/wallet/deposit
Deposits funds into the wallet.

#### POST /api/wallet/withdraw
Withdraws funds from the wallet.

#### GET /api/wallet/transactions
Retrieves transaction history.

#### POST /api/wallet/collateral/lock
Locks funds as collateral.

#### POST /api/wallet/collateral/release
Releases locked collateral.

## Development Guidelines

### Code Style
- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Write meaningful comments
- Follow the established project structure

### Git Workflow
1. Create feature branches from main
2. Commit with descriptive messages
3. Submit pull requests for review
4. Merge after approval

### Testing
- Write unit tests for critical components
- Test API endpoints
- Perform integration testing
- Test error scenarios

## Troubleshooting

### Common Issues

1. **Wallet Server Connection Issues**
   - Verify the server is running on port 3001
   - Check for any error messages in the server console
   - Ensure CORS is properly configured

2. **Database Errors**
   - Verify SQLite database file permissions
   - Check database connection settings
   - Ensure proper table structure

3. **Frontend Build Issues**
   - Clear node_modules and reinstall dependencies
   - Check for TypeScript compilation errors
   - Verify environment variables

### Support

For additional support:
1. Check the project's issue tracker
2. Review the documentation
3. Contact the development team

## Security Considerations

- API endpoints are protected with proper validation
- SQL injection prevention through parameterized queries
- CORS configuration for secure cross-origin requests
- Input sanitization and validation
- Secure storage of sensitive data

## Performance Optimization

- Implemented lazy loading for components
- Optimized database queries
- Caching strategies for frequently accessed data
- Efficient state management
- Optimized bundle size

## Future Enhancements

1. Real-time market data integration
2. Advanced trading features
3. Multi-currency support
4. Enhanced security features
5. Mobile responsiveness improvements
6. Performance optimizations
7. Additional payment gateway integrations

---

For more information or support, please refer to the project's main README or contact the development team. 