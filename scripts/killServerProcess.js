/**
 * Helper script to kill server processes by port
 */
import { execSync } from 'child_process';
import { platform } from 'os';

const API_PORT = 3001;
const SOCKET_PORT = 3002;
// Add Vite development server ports
const DEV_PORTS = [8080, 8081, 8082, 8083];

// Different commands based on operating system
const getProcessCommand = (port) => {
  if (platform() === 'win32') {
    return `netstat -ano | findstr :${port} | findstr LISTENING`;
  }
  return `lsof -i:${port} | grep LISTEN`;
};

const getKillCommand = (pid) => {
  if (platform() === 'win32') {
    return `taskkill /F /PID ${pid}`;
  }
  return `kill -9 ${pid}`;
};

// Parse the process ID from the output
const parseProcessId = (output, port) => {
  if (platform() === 'win32') {
    // Windows format is different
    const lines = output.split('\n');
    for (const line of lines) {
      // Example line: "  TCP    0.0.0.0:3001    0.0.0.0:0    LISTENING    1234"
      if (line.includes(`${port}`) && line.includes('LISTENING')) {
        const pid = line.trim().split(/\s+/).pop();
        return pid;
      }
    }
  } else {
    // Unix format
    const lines = output.split('\n');
    for (const line of lines) {
      // Example line: "node    1234 user   17u  IPv4 12345      0t0  TCP *:3001 (LISTEN)"
      if (line.includes(`${port}`) && line.includes('LISTEN')) {
        const parts = line.trim().split(/\s+/);
        return parts[1]; // PID is the second field
      }
    }
  }
  return null;
};

// Kill processes on both ports
const killProcessByPort = (port) => {
  try {
    console.log(`Checking for processes on port ${port}...`);
    
    const processCommand = getProcessCommand(port);
    let output;
    
    try {
      output = execSync(processCommand, { encoding: 'utf8' });
    } catch (error) {
      // Command may fail if no process is found, which is fine
      console.log(`No process found on port ${port}`);
      return;
    }
    
    const pid = parseProcessId(output, port);
    
    if (pid) {
      console.log(`Found process with PID ${pid} on port ${port}`);
      const killCommand = getKillCommand(pid);
      
      try {
        execSync(killCommand, { encoding: 'utf8' });
        console.log(`Successfully killed process with PID ${pid}`);
      } catch (error) {
        console.error(`Failed to kill process with PID ${pid}:`, error.message);
      }
    } else {
      console.log(`No process found running on port ${port}`);
    }
  } catch (error) {
    console.error(`Error checking port ${port}:`, error.message);
  }
};

// Main execution
console.log('Attempting to kill TradeHeaven server processes...');
killProcessByPort(API_PORT);
killProcessByPort(SOCKET_PORT);

// Also kill Vite development servers
console.log('Attempting to kill Vite development servers...');
DEV_PORTS.forEach(port => {
  killProcessByPort(port);
});

console.log('Done. All server processes should be terminated.'); 