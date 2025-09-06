import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json({ limit: "50mb" })); 
app.use(cors());
app.use(express.static("public")); 

let captures = [];

// Save capture
app.post("/save-capture", (req, res) => {
  const { time, ip, device, img } = req.body;

  if (!time || !ip || !device || !img) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const capture = { time, ip, device, img };
  captures.push(capture);

  console.log("📸 Capture saved:", capture.time);
  res.json({ message: "Capture saved successfully" });
});

app.get("/get-captures", (req, res) => {
  res.json(captures);
});

app.delete("/clear-captures", (req, res) => {
  captures = [];
  console.log("🗑️ All captures cleared.");
  res.json({ message: "All captures cleared." });
});

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
