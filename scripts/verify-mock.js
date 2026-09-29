"use strict";

const fs = require("fs");
const path = require("path");
const http = require("http");
const { spawn, execSync } = require("child_process");

const cwd = path.resolve(__dirname, "..");
const keepRunning = process.argv[2] === "--keep-running";
const mockEnvPath = path.join(cwd, ".env.mock");

const logDir = path.join(cwd, "logs");
const mockLog = path.join(logDir, "mock-api.log");
const devLog = path.join(logDir, "dev.log");
const selfLogPath = path.join(logDir, "verify-mock.log");

fs.mkdirSync(logDir, { recursive: true });
fs.writeFileSync(selfLogPath, "");
fs.writeFileSync(mockLog, "");
fs.writeFileSync(devLog, "");

let failures = 0;

function log(msg) {
  const line = "[verify-mock] " + msg + "\n";
  fs.appendFileSync(selfLogPath, line);
  process.stdout.write(line);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function httpGet(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      const b = [];
      res.on("data", (c) => b.push(c));
      res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(b).toString() }));
    });
    req.on("timeout", () => {
      req.destroy();
      resolve({ status: 0, body: "timeout" });
    });
    req.on("error", (e) => resolve({ status: 0, body: "error: " + e.message }));
    req.setTimeout(10000);
  });
}

function parseEnvFile(p) {
  const m = {};
  for (const rawLine of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const i = line.indexOf("=");
    if (i < 0) continue;
    m[line.slice(0, i).trim()] = line.slice(i + 1).replace(/^["']|["']$/g, "");
  }
  return m;
}

const mockEnv = parseEnvFile(mockEnvPath);

function devEnv() {
  const e = { ...process.env, ...mockEnv };
  delete e.PORT;
  e.PATH = path.join(cwd, "node_modules", ".bin") + ";" + (process.env.PATH || "");
  return e;
}

function spawnWithLog(cmd, args, logFile, env) {
  const child = spawn(cmd, args, {
    cwd,
    env: env || { ...process.env },
    stdio: ["ignore", "pipe", "pipe"],
  });
  const append = (data) => fs.appendFile(logFile, Buffer.from(data), () => {});
  if (child.stdout) child.stdout.on("data", append);
  if (child.stderr) child.stderr.on("data", append);
  return child;
}

function killTree(pid) {
  try {
    execSync("taskkill /F /T /PID " + pid, { stdio: "ignore" });
  } catch (e) {
    /* ok */
  }
}

function check(name, ok, detail) {
  if (ok) {
    log("[OK]   " + name);
  } else {
    failures++;
    log("[FAIL] " + name + (detail ? " — " + detail : ""));
  }
}

async function main() {
  const children = [];

  log("starting mock-api.js");
  const mock = spawnWithLog(
    process.execPath,
    [path.join(__dirname, "mock-api.js")],
    mockLog,
    { ...process.env, ...mockEnv }
  );
  children.push(mock);

  let ready = false;
  for (let i = 0; i < 30; i++) {
    const r = await httpGet("http://127.0.0.1:3001/archive/api/models?size=24");
        if (r.status === 200) {
      try {
        const d = JSON.parse(r.body);
        if (Array.isArray(d.models) && d.models.length === 24) {
          ready = true;
          break;
        }
      } catch (e) {
        /* retry */
      }
    }
    await sleep(1000);
  }
  if (!ready) {
    log("FAIL: mock API did not become ready after 30s");
    log("mock-api.log:\n" + fs.readFileSync(mockLog, "utf8").slice(-3000));
    killTree(mock.pid);
    process.exit(1);
  }
  log("mock API ready (24 models)");

  const base = "http://127.0.0.1:3001/archive/api";
  const endpoints = [
    { path: "catalog", status: 200, test: (b) => { try { return JSON.parse(b).categories.length === 6; } catch (e) { return false; } } },
    { path: "models?size=24", status: 200, test: (b) => { try { const d = JSON.parse(b); return d.models.length === 24 && d.totalElements === 24; } catch (e) { return false; } } },
    { path: "models", status: 200, test: (b) => { try { const d = JSON.parse(b); return d.models.length === 6 && d.totalElements === 24 && d.totalPages === 4; } catch (e) { return false; } } },
    { path: "models?name=lunar", status: 200, test: (b) => { try { const d = JSON.parse(b); return d.models.length === 1 && d.models[0].modelName.includes("Lunar"); } catch (e) { return false; } } },
    { path: "models?category=Vehicles&rate=4&size=10", status: 200, test: (b) => { try { const d = JSON.parse(b); return d.models.length === 2; } catch (e) { return false; } } },
    { path: "models?rate=4&size=50", status: 200, test: (b) => { try { const d = JSON.parse(b); return d.models.length === 16 && d.models.every((m) => m.rate >= 4); } catch (e) { return false; } } },
    { path: "models?nsfwOnly=true&size=10", status: 200, test: (b) => { try { const d = JSON.parse(b); return d.models.length === 6 && d.models.every((m) => m.nsfw); } catch (e) { return false; } } },
    { path: "models?sort=newest&size=3", status: 200, test: (b) => { try { return JSON.parse(b).models[0].modelName === "Flagship Diadem"; } catch (e) { return false; } } },
    { path: "models?sort=rate&size=3", status: 200, test: (b) => { try { const d = JSON.parse(b); return d.models[0].rate === 5; } catch (e) { return false; } } },
    { path: "models/suggestions/ro", status: 200, test: (b) => { try { const d = JSON.parse(b); return d.suggestions.length > 0 && d.suggestions.every((s) => s.modelName.toLowerCase().includes("ro")); } catch (e) { return false; } } },
    { path: "models/M07", status: 200, test: (b) => b.includes('"model"') && b.includes("M07") },
    { path: "models/NOPE", status: 404, test: () => true },
    { path: "admin/models/M07/update", status: 200, test: (b) => b.includes('"ok":true') || b.includes('"ok": true') },
    { path: "", status: 404, test: () => true },
  ];
  for (const ep of endpoints) {
    const r = await httpGet(base + (ep.path ? "/" + ep.path : ""));
    const ok = r.status === ep.status && ep.test(r.body);
    check("GET /archive/api/" + ep.path, ok, "status " + r.status);
  }

  const optStatus = await new Promise((resolve) => {
    const timer = setTimeout(() => resolve(0), 5000);
    fetch("http://127.0.0.1:3001/archive/api/models", {
      method: "OPTIONS",
      headers: { "Access-Control-Request-Method": "GET", "Access-Control-Request-Headers": "content-type" },
    }).then((res) => {
      clearTimeout(timer);
      resolve(res.status);
    }).catch(() => {
      clearTimeout(timer);
      resolve(0);
    });
  });
  check("CORS preflight OPTIONS /models -> 204", optStatus === 204, "got " + optStatus);

  log("starting dev server");
  const dev = spawnWithLog(
    process.execPath,
    [
      path.join(cwd, "node_modules", "react-scripts", "bin", "react-scripts.js"),
      "start",
      "--no-browser",
    ],
    devLog,
    devEnv()
  );
  children.push(dev);

  const startedAt = Date.now();
  let compiled = false;
  let failed = false;
  while (!compiled && !failed && Date.now() - startedAt < 180000) {
    const t = fs.readFileSync(devLog, "utf8");
    if (t.includes("Compiled successfully") || t.includes("Compiled with warnings")) compiled = true;
    if (t.includes("Failed to compile")) failed = true;
    await sleep(2000);
  }
  if (!compiled || failed) {
    log(failed ? "FAIL: dev server failed to compile" : "FAIL: dev server did not compile within 180s");
    log("tail of dev.log:\n" + fs.readFileSync(devLog, "utf8").slice(-3000));
    for (const c of children) killTree(c.pid);
    process.exit(1);
  }
  log("dev server compiled");

  const html = (await httpGet("http://127.0.0.1:3000/")).body;
  check("app page returns HTML", /<!doctype/i.test(html));

  const scriptSrcs = [];
  const matches = html.match(/<script[^>]+src="([^"]+)"/g) || [];
  for (const m of matches) {
    scriptSrcs.push(m.match(/src="([^"]+)"/)[1]);
  }
  let apiHostInBundle = false;
  let oldHostLeak = false;
  for (const src of scriptSrcs) {
    const url = src.startsWith("http") ? src : "http://127.0.0.1:3000" + (src.startsWith("/") ? src : "/" + src);
    const b = (await httpGet(url)).body;
    if (b.includes("localhost:3001")) apiHostInBundle = true;
    if (b.includes("172.25.250.231")) oldHostLeak = true;
  }
  check("bundles contain localhost:3001 (env from .env.mock)", apiHostInBundle, "no localhost:3001 in JS chunks");
  check("no stale API host in bundles", !oldHostLeak);

  if (failures > 0) {
    for (const c of children) killTree(c.pid);
    log("RESULT: FAILED");
    process.exit(1);
  }
  log("RESULT: ALL CHECKS PASSED");
  log("  frontend: http://127.0.0.1:3000");
  log("  mock API: http://127.0.0.1:3001/archive/api");
  if (keepRunning) {
    log("stack kept running. supervisor PID: " + process.pid);
    log("stop:  taskkill /F /PID " + process.pid + " /T");
    await new Promise(() => {});
  } else {
    for (const c of children) killTree(c.pid);
    await sleep(500);
    log("stack torn down");
  }
}

process.on("unhandledRejection", (e) => {
  log("unhandled rejection: " + (e.message || e));
  process.exit(2);
});
main().catch((e) => {
  log("error: " + e.message);
  process.exit(2);
});
