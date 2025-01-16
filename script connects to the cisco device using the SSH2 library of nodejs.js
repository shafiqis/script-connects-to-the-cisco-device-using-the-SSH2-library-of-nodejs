const { Client } = require('ssh2');

// Device details
const devices = [
  {
    host: '192.168.96.133', // Router IP
    username: 'admin',
    password: 'Hellog@123',
  },
];

// Function to execute a command on the device
function runCommand(device, command) {
  const conn = new Client();

  conn
    .on('ready', () => {
      console.log(`Connected to ${device.host}`);
      conn.exec(command, (err, stream) => {
        if (err) throw err;

        stream
          .on('close', (code, signal) => {
            console.log(`Command execution completed with code ${code}, signal ${signal}`);
            conn.end();
          })
          .on('data', (data) => {
            console.log(`OUTPUT: ${data.toString()}`);
          })
          .stderr.on('data', (data) => {
            console.error(`ERROR: ${data.toString()}`);
          });
      });
    })
    .on('error', (err) => {
      console.error(`Error connecting to ${device.host}:`, err);
    })
    .connect({
      host: device.host,
      port: 22, // Default SSH port
      username: device.username,
      password: device.password,
    });
}

// Define commands to execute
const commands = ['show ip interface brief', 'show version'];

// Run commands on each device
devices.forEach((device) => {
  commands.forEach((command) => {
    runCommand(device, command);
  });
});
