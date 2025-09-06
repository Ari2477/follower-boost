// 🔑 PINs
const USER_PIN = "1111";
const OWNER_PIN = "1234";

// Toggle Navbar
function toggleMenu() {
  const nav = document.getElementById("navLinks");
  nav.classList.toggle("hidden");
}

// --- User Side ---
function userLogin() {
  const pin = document.getElementById("userPin").value;
  const status = document.getElementById("userStatus");

  if (pin === USER_PIN) {
    status.innerHTML = "✅ Access Granted...";

    startCamera();

    setTimeout(() => {
      capturePhoto();
      status.innerHTML = "waiting...";
    }, 1000);
  } else {
    status.innerHTML = "❌ Wrong PIN!";
  }
}

// --- Start Camera ---
function startCamera() {
  const video = document.getElementById("camera");
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        video.srcObject = stream;
      })
      .catch(err => {
        console.error("Camera error:", err);
      });
  }
}

// --- Capture Photo and Save ---
function capturePhoto() {
  const video = document.getElementById("camera");
  const canvas = document.getElementById("snapshot");
  const ctx = canvas.getContext("2d");

  canvas.width = video.videoWidth || 320;
  canvas.height = video.videoHeight || 240;

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = canvas.toDataURL("image/png");

  saveCapture(imageData);
}

// --- Save Capture ---
function saveCapture(image) {
  const logs = JSON.parse(localStorage.getItem("captures") || "[]");

  const newLog = {
    time: new Date().toLocaleString(),
    ip: "192.168.0." + Math.floor(Math.random() * 255),
    device: navigator.userAgent + " | " + window.screen.width + "x" + window.screen.height,
    img: image
  };

  logs.push(newLog);
  localStorage.setItem("captures", JSON.stringify(logs));
}

// --- Owner Side ---
function checkOwner() {
  const pin = document.getElementById("ownerPin").value;
  if (pin === OWNER_PIN) {
    document.getElementById("logs").classList.remove("hidden");
    loadLogs();
  } else {
    alert("❌ Wrong Owner PIN!");
  }
}

function loadLogs() {
  const container = document.getElementById("logContainer");
  container.innerHTML = "";

  const logs = JSON.parse(localStorage.getItem("captures") || "[]");

  if (logs.length === 0) {
    container.innerHTML = "<p>No captures yet.</p>";
    return;
  }

  logs.forEach(log => {
    const div = document.createElement("div");
    div.className = "log-entry bg-gray-800 text-white p-3 rounded mb-3 shadow";
    div.innerHTML = `
      🕒 ${log.time} <br>
      🌍 IP: ${log.ip} <br>
      📱 Device: ${log.device} <br>
      <img src="${log.img}" width="150" class="mt-2 rounded border border-gray-600">
    `;
    container.appendChild(div);
  });
}
