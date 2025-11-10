import express from "express";
import fs from "fs";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json({ limit: "50mb" }));

const CAPTURE_FILE = "captures.json";

if (!fs.existsSync(CAPTURE_FILE)) {
  fs.writeFileSync(CAPTURE_FILE, "[]");
  console.log("🆕 Created captures.json file");
}

let writeQueue = Promise.resolve();

app.get("/get-captures", (req, res) => {
  fs.readFile(CAPTURE_FILE, "utf8", (err, data) => {
    if (err) return res.json([]);
    try {
      res.json(JSON.parse(data || "[]"));
    } catch {
      res.json([]);
    }
  });
});

app.post("/save-capture", (req, res) => {
  const newCapture = req.body;

  writeQueue = writeQueue.then(
    () =>
      new Promise((resolve) => {
        fs.readFile(CAPTURE_FILE, "utf8", (err, data) => {
          let logs = [];
          if (!err && data) {
            try {
              logs = JSON.parse(data || "[]");
            } catch {
              logs = [];
            }
          }

          if (!newCapture.id) newCapture.id = Date.now();
          if (!newCapture.timestamp) newCapture.timestamp = new Date().toISOString();

          logs.push(newCapture);

          fs.writeFile(
            CAPTURE_FILE,
            JSON.stringify(logs, null, 2),
            (err) => {
              if (err) {
                res.status(500).json({ success: false });
                return resolve();
              }

              io.emit("new-capture", newCapture);
              res.json({ success: true });
              resolve(); 
            }
          );
        });
      })
  );
});

app.post("/clear-captures", (req, res) => {
  fs.writeFile(CAPTURE_FILE, "[]", (err) => {
    if (err) return res.status(500).json({ success: false });
    io.emit("clear-captures");
    res.json({ success: true });
  });
});

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/public/index.html");
});

server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
