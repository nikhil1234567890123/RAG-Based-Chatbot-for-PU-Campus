import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('\x1b[32m%s\x1b[0m', '🚀 Starting BotSquad Frontend and Backend...\n');

// 1. Start Frontend (Vite)
const frontend = spawn('npx', ['vite'], {
  cwd: path.join(__dirname, 'frontend'),
  shell: true,
  stdio: 'pipe',
});

frontend.stdout.on('data', (data) => {
  process.stdout.write(`\x1b[36m[FRONTEND]\x1b[0m ${data}`);
});

frontend.stderr.on('data', (data) => {
  process.stderr.write(`\x1b[31m[FRONTEND ERR]\x1b[0m ${data}`);
});

// 2. Start Backend (Flask / Python)
const backendPython = path.join(__dirname, 'backend', 'src', 'Final Backend', 'venv', 'Scripts', 'python.exe');
const backendDir = path.join(__dirname, 'backend', 'src', 'Final Backend');

const backend = spawn(backendPython, ['app.py'], {
  cwd: backendDir,
  shell: true,
  stdio: 'pipe',
});

backend.stdout.on('data', (data) => {
  process.stdout.write(`\x1b[33m[BACKEND]\x1b[0m ${data}`);
});

backend.stderr.on('data', (data) => {
  process.stderr.write(`\x1b[33m[BACKEND]\x1b[0m ${data}`);
});

// Handle clean exit
const cleanup = () => {
  console.log('\n🛑 Stopping Frontend and Backend servers...');
  try { frontend.kill(); } catch (e) {}
  try { backend.kill(); } catch (e) {}
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
