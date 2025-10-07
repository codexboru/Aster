let dataStore = [];

function saveData() {
  const date = document.getElementById("dateInput").value;
  const time = document.getElementById("timeInput").value;
  const notional = parseFloat(document.getElementById("notionalInput").value);
  const longPercent = parseFloat(document.getElementById("longInput").value);
  const shortPercent = parseFloat(document.getElementById("shortInput").value);

  if (!date || !time || isNaN(notional) || isNaN(longPercent) || isNaN(shortPercent)) return;

  const longRatio = (longPercent / 100).toFixed(4);
  const shortRatio = (shortPercent / 100).toFixed(4);
  const longUSD = notional * longRatio;
  const shortUSD = notional * shortRatio;

  const entry = {
    date, time, longPercent, shortPercent,
    longRatio, shortRatio,
    longUSD: Math.round(longUSD),
    shortUSD: Math.round(shortUSD)
  };

  dataStore.push(entry);
  renderTable();
}

function renderTable() {
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";

  dataStore.forEach((entry, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.date}</td>
      <td>${entry.time}</td>
      <td>${entry.longPercent}%</td>
      <td>${entry.shortPercent}%</td>
      <td>${(entry.longRatio * 100).toFixed(2)}%</td>
      <td>${(entry.shortRatio * 100).toFixed(2)}%</td>
      <td class="${entry.longUSD > entry.shortUSD ? 'highlight-blink' : ''}">$${entry.longUSD.toLocaleString()}</td>
      <td class="${entry.shortUSD > entry.longUSD ? 'highlight-blink' : ''}">$${entry.shortUSD.toLocaleString()}</td>
      <td><button onclick="deleteRow(${index})">🗑️</button></td>
    `;
    tbody.appendChild(row);
  });
}

function deleteRow(index) {
  dataStore.splice(index, 1);
  renderTable();
}

function downloadJSON() {
  const blob = new Blob([JSON.stringify(dataStore, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "asterdex-data.json";
  a.click();
  URL.revokeObjectURL(url);
}

function uploadJSON() {
  const fileInput = document.getElementById("jsonUpload");
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const json = JSON.parse(e.target.result);
      if (Array.isArray(json)) {
        dataStore = json;
        renderTable();
      }
    } catch (err) {
      alert("Ungültige JSON-Datei.");
    }
  };
  reader.readAsText(file);
}

// Bild-Upload
document.getElementById("imageUpload").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    document.getElementById("uploadedImage").innerHTML = `<img src="${e.target.result}" alt="Chart Bild" />`;
  };
  reader.readAsDataURL(file);
});

// Dark/Light Mode Toggle
function toggleMode() {
  const body = document.body;
  const button = document.getElementById("modeToggle");

  if (body.classList.contains("dark-mode")) {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
    button.textContent = "☀️";
  } else {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
    button.textContent = "🌙";
  }
}
