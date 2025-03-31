import express from "express";
import * as path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// Serve static files from 'dist'
const staticDir = path.join(__dirname, "..", "dist");
app.use(express.static(staticDir));

// API route for /api/documents/:id
app.get("/api/documents/:id", async (req, res) => {
  try {
    const result = await axios.get(
      `${process.env["DATA_SERVER"]}/${req.path}?t=${req.query.t}`
    );
    return res.json(result.data.data);
  } catch (error) {
    console.error(`Failed to retrieve document data due to - ${error.message}`);
    return res.status(400).json({ success: false });
  }
});

// Catch-all route for SPA: serve index.html for non-API, non-static requests
app.get("*", (req, res) => {
  const file = path.join(staticDir, req.path.replace("/documents", ""));
  if (fs.existsSync(file)) {
    return res.sendFile(file);
  }
  const indexHtml = path.join(staticDir, "index.html");
  res.sendFile(indexHtml);
});

app.listen(3001, "0.0.0.0", () => console.log("Server running on port 3001"));
