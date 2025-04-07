# TradeHeaven - MarketFlow Dynamics

A multi-user trading platform with real-time updates and auto-cleanup functionality.

## Features

- User authentication system with JWT
- Real-time trading capabilities
- Portfolio management
- Watchlists for tracking stocks
- Wallet system for managing funds
- Auto-cleanup for server processes

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm package manager

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/marketflow-dynamics.git
   cd marketflow-dynamics
   ```

2. Install dependencies:
   ```
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   node start-wallet-server.js
   ```

2. In a separate terminal, start the frontend development server:
   ```
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8081
   ```

## Auto-Cleanup Functionality

The application has built-in auto-cleanup functionality that will automatically shut down the server when:

1. No clients are connected for 30 minutes
2. The system receives a shutdown signal (Ctrl+C)
3. The application crashes unexpectedly

### How It Works

- A socket.io server tracks client connections
- When clients disconnect, a shutdown timer starts
- If no new connections are made within the timeout period, the server shuts down
- This ensures resources are freed when the application is not in use

### Testing with Multiple Users

To test multi-user functionality locally:

1. Open the application in different browsers (e.g., Chrome, Firefox, Edge)
2. Or use private/incognito windows in the same browser
3. Register different user accounts in each window
4. Perform transactions between accounts to test the trading functionality

## Troubleshooting

If the server won't start due to "address already in use" errors:

1. Find the process using port 3001:
   ```
   # On Windows
   netstat -ano | findstr :3001
   
   # On macOS/Linux
   lsof -i :3001
   ```

2. Kill the process:
   ```
   # On Windows (replace PID with actual process ID)
   taskkill /F /PID PID
   
   # On macOS/Linux
   kill -9 PID
   ```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
