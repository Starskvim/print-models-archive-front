"use strict";

/**
 * Local mock API for visual checks without the backend.
 * Run: node scripts/mock-api.js  (serves http://localhost:3001/archive/api)
 * Pair with: yarn start:mock
 */

const http = require("http");

const PORT = 3001;

function img(id, i, w, h) {
  return `https://picsum.photos/seed/${id}-${i}/${w}/${h}`;
}

const MODELS = [
  { id: "M01", modelName: "Nebula Cruiser Alpha", category: "Vehicles", rate: 4.8, nsfw: false, addedAt: "2026-01-15T09:30:00Z" },
  { id: "M02", modelName: "Cyber Fox", category: "Animals", rate: 4.5, nsfw: false, addedAt: "2025-11-02T14:05:00Z" },
  { id: "M03", modelName: "Hoverbike Raptor", category: "Vehicles", rate: 3.9, nsfw: false, addedAt: "2025-09-28T08:12:00Z" },
  { id: "M04", modelName: "Star Knight", category: "Characters", rate: 5.0, nsfw: false, addedAt: "2025-12-11T17:45:00Z" },
  { id: "M05", modelName: "Holo Lantern", category: "Props", rate: 3.2, nsfw: true, addedAt: "2024-08-19T10:20:00Z" },
  { id: "M06", modelName: "Sentinel R-7", category: "Robots", rate: 4.2, nsfw: true, addedAt: "2025-07-30T12:00:00Z" },
  { id: "M07", modelName: "Lunar Cat", category: "Animals", rate: 4.7, nsfw: false, addedAt: "2026-02-05T06:40:00Z" },
  { id: "M08", modelName: "Cryopod Chamber", category: "Props", rate: 4.1, nsfw: false, addedAt: "2025-05-14T15:30:00Z" },
  { id: "M09", modelName: "Void Walker", category: "Characters", rate: 3.6, nsfw: true, addedAt: "2024-12-03T11:00:00Z" },
  { id: "M10", modelName: "Cargo Hauler M4", category: "Vehicles", rate: 4.0, nsfw: false, addedAt: "2025-03-22T19:25:00Z" },
  { id: "M11", modelName: "Star Whale", category: "Animals", rate: 4.9, nsfw: false, addedAt: "2026-03-18T07:55:00Z" },
  { id: "M12", modelName: "Battle Mech Goliath", category: "Robots", rate: 4.6, nsfw: false, addedAt: "2025-10-07T13:10:00Z" },
  { id: "M13", modelName: "Neon Panther", category: "Animals", rate: 4.3, nsfw: false, addedAt: "2025-06-25T16:00:00Z" },
  { id: "M14", modelName: "Ancient Relic", category: "Props", rate: 3.8, nsfw: true, addedAt: "2024-05-11T09:00:00Z" },
  { id: "M15", modelName: "Scout Drone", category: "Vehicles", rate: 3.5, nsfw: false, addedAt: "2025-04-30T18:40:00Z" },
  { id: "M16", modelName: "Domestic Droid", category: "Robots", rate: 4.4, nsfw: true, addedAt: "2025-08-16T10:00:00Z" },
  { id: "M17", modelName: "Plasma Cannon", category: "Props", rate: 4.2, nsfw: false, addedAt: "2026-04-02T20:15:00Z" },
  { id: "M18", modelName: "Mech Dragon", category: "Characters", rate: 4.7, nsfw: false, addedAt: "2025-09-12T08:30:00Z" },
  { id: "M19", modelName: "Nano Swarm Unit", category: "Robots", rate: 3.4, nsfw: false, addedAt: "2025-01-27T14:20:00Z" },
  { id: "M20", modelName: "Mystery Reliquary", category: "Props", rate: 5.0, nsfw: false, addedAt: "2026-05-19T11:05:00Z" },
  { id: "M21", modelName: "Star Fox", category: "Characters", rate: 4.1, nsfw: false, addedAt: "2024-11-30T17:00:00Z" },
  { id: "M22", modelName: "Cave Spider", category: "Animals", rate: 3.3, nsfw: true, addedAt: "2025-12-28T05:20:00Z" },
  { id: "M23", modelName: "Rover Explorer", category: "Vehicles", rate: 3.7, nsfw: false, addedAt: "2026-06-14T12:40:00Z" },
  { id: "M24", modelName: "Flagship Diadem", category: "Main", rate: 4.9, nsfw: false, addedAt: "2026-07-08T09:00:00Z" },
];

const byId = new Map(MODELS.map((m) => [m.id, m]));

function categoriesWithSizes() {
  const counts = new Map();
  for (const m of MODELS) {
    counts.set(m.category, (counts.get(m.category) || 0) + 1);
  }
  const ordered = ["Main", "Characters", "Vehicles", "Robots", "Props", "Animals"];
  return ordered.map((name) => ({
    name,
    size: counts.get(name) || 0,
    level: 1,
    children: [],
  }));
}

function cardOf(m) {
  return {
    id: m.id,
    preview: img(m.id, 0, 900, 600),
    modelName: m.modelName,
    rate: m.rate,
    nsfw: m.nsfw,
    category: m.category,
    categories: [m.category],
    images: [img(m.id, 0, 900, 600), img(m.id, 1, 900, 600), img(m.id, 2, 900, 600)],
    addedAt: m.addedAt,
  };
}

function fullModel(m) {
  return {
    ...m,
    preview: img(m.id, 0, 900, 600),
    categories: [m.category],
    path: `/models/${m.id}`,
    oths: [
      { preview: img(m.id, 1, 900, 600) },
      { preview: img(m.id, 2, 900, 600) },
    ],
    zips: [
      { fileName: `${m.id}-main.stl`, format: "STL", size: "14.2 MB" },
      { fileName: `${m.id}-full.obj`, format: "OBJ", size: "22.7 MB" },
    ],
  };
}

function send(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(body, null, 2));
}

function handleCatalog(res) {
  const cats = categoriesWithSizes();
  send(res, 200, { catalog: cats, categories: cats });
}

function handleModelsList(q, res) {
  let list = MODELS;
  const name = (q.name || "").trim().toLowerCase();
  if (name) list = list.filter((m) => m.modelName.toLowerCase().includes(name));
  if (q.category) list = list.filter((m) => m.category === q.category);
  if (q.rate && q.rate !== "all") list = list.filter((m) => m.rate >= Number(q.rate));
  if (q.nsfwOnly === "true") list = list.filter((m) => m.nsfw);

  let sorted;
  if (q.sort === "rate") {
    sorted = [...list].sort((a, b) => b.rate - a.rate);
  } else if (q.sort === "newest") {
    sorted = [...list].sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
  } else {
    sorted = [...list].sort((a, b) => a.modelName.localeCompare(b.modelName, "ru"));
  }

  const size = Math.max(1, parseInt(q.size, 10) || 6);
  const page = Math.max(0, parseInt(q.page, 10) || 0);
  const totalElements = sorted.length;
  const totalPages = Math.ceil(totalElements / size);
  send(res, 200, {
    models: sorted.slice(page * size, page * size + size).map(cardOf),
    totalElements,
    totalPages,
  });
}

function handleSuggestions(q, res) {
  const needle = (q || "").trim().toLowerCase();
  let list = MODELS;
  if (needle) {
    list = list.filter((m) => m.modelName.toLowerCase().includes(needle));
  }
  const suggestions = list.slice(0, 3).map((m) => ({
    id: m.id,
    preview: img(m.id, 0, 400, 400),
    modelName: m.modelName,
    category: m.category,
    mainCategory: m.category,
    rate: m.rate,
    nsfw: m.nsfw,
  }));
  send(res, 200, { suggestions });
}

function handleModelDetail(id, res) {
  const m = byId.get(id);
  if (!m) {
    send(res, 404, { error: `Model not found: ${id}` });
    return;
  }
  send(res, 200, { model: fullModel(m) });
}

function handleAdmin(action, res) {
  send(res, 200, { ok: true, message: `Mock: ${action} done` });
}

function route(req, res) {
  const { pathname, searchParams } = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Max-Age": "86400",
    });
    res.end();
    return;
  }

  if (pathname.startsWith("/archive/api/admin")) {
    const action = decodeURIComponent(pathname.slice("/archive/api/admin".length).replace(/^\//, "") || "action");
    handleAdmin(action, res);
    return;
  }

  if (req.method !== "GET") {
    send(res, 405, { error: "Method not allowed" });
    return;
  }

  if (pathname === "/archive/api/catalog") {
    handleCatalog(res);
    return;
  }

  if (pathname === "/archive/api/models") {
    handleModelsList(Object.fromEntries(searchParams), res);
    return;
  }

  if (pathname.startsWith("/archive/api/models/suggestions/")) {
    const q = pathname.slice("/archive/api/models/suggestions/".length);
    handleSuggestions(decodeURIComponent(q), res);
    return;
  }

  if (pathname.startsWith("/archive/api/models/")) {
    const id = pathname.slice("/archive/api/models/".length);
    handleModelDetail(decodeURIComponent(id), res);
    return;
  }

  send(res, 404, { error: "Not found", path: pathname });
}

const server = http.createServer((req, res) => {
  try {
    route(req, res);
  } catch (err) {
    if (!res.headersSent) {
      send(res, 500, { error: "Internal mock error" });
    }
    console.error("[mock-api] error:", err.message);
  } finally {
    console.log(`[mock-api] ${req.method} ${req.url} -> ${res.statusCode || "pending"}`);
  }
});

server.listen(PORT, () => {
  console.log(`[mock-api] ready: http://localhost:${PORT}/archive/api`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`[mock-api] port ${PORT} is already in use`);
  }
  process.exit(1);
});
