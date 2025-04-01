
# TradeHeaven Trading Platform

This is a demo-level trading platform with a fully functional wallet system.

## Features

- **Wallet Management**: Deposit and withdraw funds
- **Collateral System**: Lock and release funds for trading
- **Transaction History**: View all your financial activities
- **Real-time Feedback**: Get notifications for all actions

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

### Running the Application

You need to start both the wallet server and frontend:

#### Start the Wallet Server (Method 1 - Recommended)
```
node start-wallet-server.js
```

#### Start the Wallet Server (Method 2 - Alternative)
```
node src/server/index.js
```

#### Start the Frontend (in a separate terminal)
```
npm run dev
```

## Using the Wallet System

The wallet system is a demonstration with a SQLite database. It allows you to:

1. **Deposit Funds**: Add money to your trading account
2. **Withdraw Funds**: Remove available funds from your account
3. **Manage Collateral**: Lock funds for trading and release them when done
4. **View Transactions**: See a history of all your financial activities

## Troubleshooting

If you see "Failed to load wallet data" errors:
1. Make sure the wallet server is running in a separate terminal
2. Check that the server is accessible on port 3001
3. Look for any error messages in the server terminal

## Implementation Details

- **Frontend**: React with Tailwind CSS and ShadcnUI
- **Backend**: Express.js with SQLite
- **State Management**: React Hooks and Context
- **Data Visualization**: Recharts

## Notes

This is a demonstration application. In a production environment, you would integrate with real payment processors and financial institutions.
