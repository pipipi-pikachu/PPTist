import express from "express";
import { getTemplateById } from "./documents/_load.js";

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  ); // Allowed methods
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Allowed headers

  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // Respond to preflight requests
  }

  next();
});

app.get(`/api/documents/:id`, (req, res) => {
  const id = req.params.id;
  return res.json(getTemplateById(id));
});

app.listen(5001, () => {
  console.log(`Serving: http://127.0.0.1:5001`);
});
