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

      io.emit("new-capture", newCapture);

      res.json({ success: true });
    });
  });
});

app.post("/clear-captures", (req, res) => {
  fs.writeFile("captures.json", "[]", err => {
    if (err) return res.status(500).json({ success: false });
    io.emit("clear-captures"); 
    res.json({ success: true });
  });
});

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/public/index.html");
});

server.listen(PORT, () => console.log(`✅ Server running on ${PORT}`));
