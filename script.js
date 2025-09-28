const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

// Load counts and attendee list from localStorage or set to 0/empty
let count = parseInt(localStorage.getItem("totalCount")) || 0;
let waterCount = parseInt(localStorage.getItem("waterCount")) || 0;
let zeroCount = parseInt(localStorage.getItem("zeroCount")) || 0;
let powerCount = parseInt(localStorage.getItem("powerCount")) || 0;
let attendeeList = JSON.parse(localStorage.getItem("attendeeList")) || [];
const maxCount = 50;

// Set initial values on page
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("attendeeCount").textContent = count;
  document.getElementById("waterCount").textContent = waterCount;
  document.getElementById("zeroCount").textContent = zeroCount;
  document.getElementById("powerCount").textContent = powerCount;
  const percentage = Math.round((count / maxCount) * 100) + "%";
  document.getElementById("progressBar").style.width = percentage;
  renderAttendeeList();
});

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  if (!name || !team) {
    alert("Please fill in all fields.");
    return;
  }

  const checkInData = {
    name: name,
    team: team,
  };

  console.log("Check-in data:", checkInData);

  // Update counts
  count++;
  if (team === "water") {
    waterCount++;
    localStorage.setItem("waterCount", waterCount);
  } else if (team === "zero") {
    zeroCount++;
    localStorage.setItem("zeroCount", zeroCount);
  } else if (team === "power") {
    powerCount++;
    localStorage.setItem("powerCount", powerCount);
  }
  localStorage.setItem("totalCount", count);

  // Update attendee count on the page
  document.getElementById("attendeeCount").textContent = count;
  document.getElementById("waterCount").textContent = waterCount;
  document.getElementById("zeroCount").textContent = zeroCount;
  document.getElementById("powerCount").textContent = powerCount;

  const percentage = Math.round((count / maxCount) * 100) + "%";
  document.getElementById("progressBar").style.width = percentage;

  // Add attendee to list and save
  attendeeList.push({ name: name, team: teamName });
  localStorage.setItem("attendeeList", JSON.stringify(attendeeList));
  renderAttendeeList();

  // Show greeting
  const greeting = document.getElementById("greeting");
  let teamEmoji = "";
  if (team === "water") {
    teamEmoji = "🌊";
  } else if (team === "zero") {
    teamEmoji = "🌿";
  } else if (team === "power") {
    teamEmoji = "⚡";
  }
  const message = `🎉 <b>Welcome, ${name}!</b> ${teamEmoji}<br><span style='font-size:1.1em;'>You have checked in for <b>${teamName}</b>!</span>`;
  greeting.innerHTML = message;
  greeting.classList.add("success-message");
  greeting.style.display = "block";
  // Render attendee list
  function renderAttendeeList() {
    const attendeeListEl = document.getElementById("attendeeList");
    attendeeListEl.innerHTML = "";
    attendeeList.forEach(function (att) {
      const li = document.createElement("li");
      li.innerHTML = `<span>${att.name}</span> <span class="attendee-team">${att.team}</span>`;
      attendeeListEl.appendChild(li);
    });
  }

  // Check for goal reached
  if (count >= maxCount) {
    showCelebration();
  }

  form.reset();
});

function showCelebration() {
  // Find the winning team
  const water = parseInt(document.getElementById("waterCount").textContent);
  const zero = parseInt(document.getElementById("zeroCount").textContent);
  const power = parseInt(document.getElementById("powerCount").textContent);
  let winner = "";
  let winnerLabel = "";
  if (water >= zero && water >= power) {
    winner = "water";
    winnerLabel = "Team Water Wise";
  } else if (zero >= water && zero >= power) {
    winner = "zero";
    winnerLabel = "Team Net Zero";
  } else {
    winner = "power";
    winnerLabel = "Team Renewables";
  }

  // Create overlay
  const overlay = document.createElement("div");
  overlay.className = "celebration-overlay";
  overlay.innerHTML = `<div>🎉 Goal Reached! 🎉<br><br>Congratulations <span style="color:#00c7fd;">${winnerLabel}</span>!</div>`;

  // Add confetti
  for (let i = 0; i < 60; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.background = `hsl(${Math.random() * 360},90%,60%)`;
    confetti.style.animationDelay = Math.random() * 1.5 + "s";
    overlay.appendChild(confetti);
  }

  document.body.appendChild(overlay);

  // Remove overlay after 6 seconds
  setTimeout(function () {
    overlay.remove();
  }, 6000);
}
