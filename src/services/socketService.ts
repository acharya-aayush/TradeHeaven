import { io, Socket } from 'socket.io-client';

// Socket.io service for client tracking and real-time updates
class SocketService {
  private socket: Socket | null = null;
  private reconnectInterval: number = 5000; // 5 seconds
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectTimer: number | null = null;
  private isConnecting: boolean = false;
  private initialized: boolean = false;
  private useDevMode: boolean = true; // Set to true to use mock implementation instead of actual connections

  // Initialize socket connection
  public init(): void {
    if (this.initialized) return;
    this.initialized = true;

    // Set up document visibility change listener
    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    if (this.useDevMode) {
      // For testing purposes, don't actually connect to the socket
      // This prevents errors when the server is not running
      console.log('Connecting to socket server...');
      setTimeout(() => {
        console.log('Socket connected. Client is being tracked.');
      }, 500);
      return;
    }

    try {
      this.socket = io('http://localhost:3002', {
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000
      });

      this.socket.on('connect', this.handleConnect);
      this.socket.on('disconnect', this.handleDisconnect);
      this.socket.on('error', this.handleError);
      this.socket.on('reconnect_attempt', this.handleReconnectAttempt);
    } catch (error) {
      console.error('Socket connection error:', error);
      this.scheduleReconnect();
    }
  }

  // Clean up on component unmount
  public cleanup(): void {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    
    this.initialized = false;
    this.isConnecting = false;
    this.reconnectAttempts = 0;
  }

  // Handle visibility change (tab/window focus)
  private handleVisibilityChange = (): void => {
    if (document.visibilityState === 'hidden') {
      console.log('Page hidden, still maintaining connection');
    } else {
      console.log('Page visible, resuming normal operation');
    }
  };

  // Handle successful connection
  private handleConnect = (): void => {
    console.log('Socket connected. Client is being tracked.');
    this.reconnectAttempts = 0;
    this.isConnecting = false;
  };

  // Handle disconnection
  private handleDisconnect = (reason: string): void => {
    console.log(`Socket disconnected. Reason: ${reason}`);
    
    // Only attempt to reconnect if not in dev mode
    if (!this.useDevMode) {
      this.scheduleReconnect();
    }
  };

  // Handle connection error
  private handleError = (error: Error): void => {
    console.error('Socket error:', error);
    
    // Only attempt to reconnect if not in dev mode
    if (!this.useDevMode) {
      this.scheduleReconnect();
    }
  };

  // Handle reconnection attempt
  private handleReconnectAttempt = (attempt: number): void => {
    console.log(`Reconnection attempt ${attempt}`);
    this.reconnectAttempts = attempt;
  };

  // Schedule a reconnection attempt
  private scheduleReconnect(): void {
    // Don't attempt reconnection in dev mode
    if (this.useDevMode) {
      return;
    }
    
    if (this.isConnecting || this.reconnectAttempts >= this.maxReconnectAttempts) {
      return;
    }

    this.isConnecting = true;
    
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
    }
    
    this.reconnectTimer = window.setTimeout(() => {
      console.log(`Attempting to reconnect (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})...`);
      this.reconnectAttempts++;
      this.isConnecting = false;
      this.init();
    }, this.reconnectInterval);
  }
}

// Export a singleton instance
export const socketService = new SocketService(); 