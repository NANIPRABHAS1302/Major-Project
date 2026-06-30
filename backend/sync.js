import fs from 'fs';
import path from 'path';

function copyRecursive(src, dest, excludeDirs = []) {
  if (excludeDirs.includes(path.basename(src))) {
    return;
  }
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursive(
        path.join(src, childItemName),
        path.join(dest, childItemName),
        excludeDirs
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

const rootDir = 'C:\\Royal-Task-Manager';

console.log('Copying backend to server...');
copyRecursive(
  path.join(rootDir, 'backend'),
  path.join(rootDir, 'server'),
  ['node_modules', '.env', 'sync.js', 'package-lock.json']
);

console.log('Copying frontend to client...');
copyRecursive(
  path.join(rootDir, 'frontend'),
  path.join(rootDir, 'client'),
  ['node_modules', '.env', 'dist', 'package-lock.json']
);

// Create specific alias/middleware files in server to match the expected skeleton structure
console.log('Creating server middleware aliases...');
const serverMiddlewareDir = path.join(rootDir, 'server', 'middleware');
fs.mkdirSync(serverMiddlewareDir, { recursive: true });

fs.writeFileSync(
  path.join(serverMiddlewareDir, 'authMiddleware.js'),
  `import { protect, authorize } from './auth.js';\nexport { protect, authorize };\n`
);

fs.writeFileSync(
  path.join(serverMiddlewareDir, 'validateMiddleware.js'),
  `import { validate } from './validate.js';\nexport { validate };\n`
);

console.log('Creating server validator files...');
const serverValidatorsDir = path.join(rootDir, 'server', 'validators');
fs.mkdirSync(serverValidatorsDir, { recursive: true });

// Copy validators.js to authValidator.js and taskValidator.js
const validatorsContent = fs.readFileSync(path.join(serverMiddlewareDir, 'validators.js'), 'utf8');

fs.writeFileSync(
  path.join(serverValidatorsDir, 'authValidator.js'),
  validatorsContent
);

fs.writeFileSync(
  path.join(serverValidatorsDir, 'taskValidator.js'),
  validatorsContent
);

console.log('Sync completed successfully.');
