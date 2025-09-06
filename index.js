// 🔑 PINs
const USER_PIN = "1111";
const OWNER_PIN = "1234";

// Toggle Nav
function toggleMenu() {
  const nav = document.getElementById("navLinks");
  nav.classList.toggle("hidden");
}

// --- User Side ---
function userLogin() {
  const pin = document.getElementById("userPin").value;
  const status = document.getElementById("userStatus");

  if (pin === USER_PIN) {
    status.innerHTML = "✅ Access Granted. Auto-capturing...";

    setTimeout(() => {
      saveCapture();
      status.innerHTML = "📸 Capture saved to history.";
    }, 1000);
  } else {
    status.innerHTML = "❌ Wrong PIN!";
  }
}

// --- Save fake capture ---
function saveCapture() {
  const logs = JSON.parse(localStorage.getItem("captures") || "[]");

  const newLog = {
    time: new Date().toLocaleString(),
    ip: "192.168.0." + Math.floor(Math.random() * 255),
    device: navigator.userAgent + " | " + window.screen.width + "x" + window.screen.height,
    img: "https://via.placeholder.com/150"
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
    div.className = "log-entry";
    div.innerHTML = `
      🕒 ${log.time} <br>
      🌍 IP: ${log.ip} <br>
      📱 Device: ${log.device} <br>
      <img src="${log.img}" width="120" class="mt-2 rounded">
    `;
    container.appendChild(div);
  });
}
