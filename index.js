import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;
const CAPTURE_FILE = path.join(process.cwd(), "captures.json");

app.use(express.json({ limit: "20mb" })); // allow bigger images
app.use(express.static(".")); // serve index.html + owner.html

// Save capture
app.post("/save-capture", (req, res) => {
  let logs = [];
  if (fs.existsSync(CAPTURE_FILE)) {
    logs = JSON.parse(fs.readFileSync(CAPTURE_FILE));
  }
  logs.push(req.body);
  fs.writeFileSync(CAPTURE_FILE, JSON.stringify(logs, null, 2));
  res.json({ success: true });
});

// Get captures
app.get("/get-captures", (req, res) => {
  if (fs.existsSync(CAPTURE_FILE)) {
    const logs = JSON.parse(fs.readFileSync(CAPTURE_FILE));
    res.json(logs);
  } else {
    res.json([]);
  }
});

// Clear captures
app.post("/clear-captures", (req, res) => {
  fs.writeFileSync(CAPTURE_FILE, JSON.stringify([]));
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
