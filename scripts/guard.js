const fs = require('fs');
const path = require('path');

function checkFile(filepath, check) {
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    return check(content);
  } catch (e) {
    console.error(`Error reading ${filepath}:`, e);
    return false;
  }
}

// Sprawdź provider w schema.prisma
function checkPrismaProvider() {
  const result = checkFile('prisma/schema.prisma', content => {
    return content.includes('provider = "sqlite"');
  });
  
  if (!result) {
    console.error('\x1b[31mError: prisma/schema.prisma must use sqlite provider\x1b[0m');
    return false;
  }
  return true;
}

// Sprawdź middleware.ts
function checkMiddleware() {
  const result = checkFile('middleware.ts', content => {
    return !content.includes('@/lib/prisma') && !content.includes('@/lib/session');
  });
  
  if (!result) {
    console.error('\x1b[31mError: middleware.ts cannot import prisma or session\x1b[0m');
    return false;
  }
  return true;
}

// Sprawdź runtime edge w plikach z importem prisma
function checkPrismaImports() {
  const files = fs.readdirSync('app', { recursive: true });
  
  for (const file of files) {
    if (!file.endsWith('.ts') && !file.endsWith('.tsx')) continue;
    
    const filepath = path.join('app', file);
    const content = fs.readFileSync(filepath, 'utf8');
    
    if (content.includes('@/lib/prisma') && content.includes('runtime = "edge"')) {
      console.error(`\x1b[31mError: ${filepath} imports prisma but uses edge runtime\x1b[0m`);
      return false;
    }
  }
  return true;
}

// Sprawdź .gitignore
function checkGitignore() {
  const result = checkFile('.gitignore', content => {
    return content.includes('data/') && content.includes('.env');
  });
  
  if (!result) {
    console.error('\x1b[31mError: .gitignore must include data/ and .env\x1b[0m');
    return false;
  }
  return true;
}

// Uruchom wszystkie testy
const checks = [
  checkPrismaProvider,
  checkMiddleware,
  checkPrismaImports,
  checkGitignore
];

for (const check of checks) {
  if (!check()) {
    process.exit(1);
  }
}

console.log('\x1b[32mAll checks passed!\x1b[0m');
process.exit(0);