#!/usr/bin/env node
const fs = require("fs");
function warn(msg){ console.warn("\x1b[33m[guard:warn]\x1b[0m " + msg); }
function ok(msg){ console.log("\x1b[32m[guard]\x1b[0m " + msg); }
let warned = false;
try {
  const gi = fs.readFileSync(".gitignore","utf8");
  const hasData = gi.includes("data/");
  const hasEnv  = gi.includes(".env");
  if (!hasData || !hasEnv){ warn(".gitignore powinno zawierać wpisy: 'data/' i '.env'"); warned = true; }
} catch { warn(".gitignore nie znaleziono"); warned = true; }
ok(warned ? "commit dozwolony (z ostrzeżeniem)" : "wszystko OK");
process.exit(0);