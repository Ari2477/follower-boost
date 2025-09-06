import express from "express";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Serve static files (HTML, CSS, JS)
app.use(express.static("public"));

// Para sa JSON storage
app.use(express.json({ limit: "50mb" }));

// Routes para sa captures
app.get("/get-captures", (req, res) => {
  fs.readFile("captures.json", "utf8", (err, data) => {
    if (err) return res.json([]);
    res.json(JSON.parse(data || "[]"));
  });
});

app.post("/save-capture", (req, res) => {
  const newCapture = req.body;

  fs.readFile("captures.json", "utf8", (err, data) => {
    let logs = [];
    if (!err && data) logs = JSON.parse(data);

    logs.push(newCapture);

    fs.writeFile("captures.json", JSON.stringify(logs, null, 2), err => {
      if (err) return res.status(500).json({ success: false });
      res.json({ success: true });
    });
  });
});

app.post("/clear-captures", (req, res) => {
  fs.writeFile("captures.json", "[]", err => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true });
  });
});

// ✅ Default route → load index.html
app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/public/index.html");
});

app.listen(PORT, () => console.log(`✅ Server running on ${PORT}`));
