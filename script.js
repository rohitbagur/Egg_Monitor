let totalWeight = 0;
let eggCount = 0;

function addEggData() {
    const tableBody = document.getElementById('table-body');
    const weight = Math.floor(Math.random() * (70 - 45 + 1) + 45); // Mock weight 45g-70g
    const time = new Date().toLocaleTimeString();
    
    // Logic for Grade (Insights)
    let grade = "Medium";
    if (weight > 62) grade = "Large";
    if (weight < 53) grade = "Small";

    // Update Stats
    eggCount++;
    totalWeight += weight;
    document.getElementById('total-count').innerText = eggCount;
    document.getElementById('avg-weight').innerText = (totalWeight / eggCount).toFixed(1) + "g";

    // Add to Table (Newest on top)
    const row = `<tr><td>${time}</td><td>${weight}g</td><td>${grade}</td></tr>`;
    tableBody.insertAdjacentHTML('afterbegin', row);
}

// Simulate an IoT event every 5 seconds
setInterval(addEggData, 5000);
addEggData(); // Add first one immediately