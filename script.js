let totalWeight = 0;
let eggCount = 0;

async function listenForHardwareData() {
    const statusBadge = document.getElementById('connection-status');
    try {
        const response = await fetch('http://localhost:8001/stream');
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        // Switch badge status to green if connected successfully
        statusBadge.innerText = "IoT Live Stream Active";
        statusBadge.className = "badge connected";
        document.getElementById('system-mode').innerText = "MONITORING";

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            
            const rawData = decoder.decode(value);
            const egg = JSON.parse(rawData);
            
            updateDashboardWithRealData(egg.weight, egg.image_data);
        }
    } catch (error) {
        // Handle fallback connection states safely
        statusBadge.innerText = "Awaiting Local Hardware connection...";
        statusBadge.className = "badge disconnected";
        document.getElementById('system-mode').innerText = "STANDBY";
        setTimeout(listenForHardwareData, 2000); 
    }
}

function updateDashboardWithRealData(weight, base64Image) {
    const tableBody = document.getElementById('table-body');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    let grade = "Medium";
    if (weight > 62) grade = "Large";
    if (weight < 53) grade = "Small";

    eggCount++;
    totalWeight += parseFloat(weight);
    
    // Update numerical metadata calculations
    document.getElementById('total-count').innerText = eggCount;
    document.getElementById('avg-weight').innerText = (totalWeight / eggCount).toFixed(1) + "g";

    // Update the Large Central Viewer Panel
    const placeholder = document.getElementById('viewer-placeholder');
    const largeImg = document.getElementById('large-egg-image');
    const imgLabel = document.getElementById('viewer-label');

    placeholder.style.display = 'none'; // Clear out message notice text
    largeImg.src = `data:image/jpeg;base64,${base64Image}`;
    largeImg.className = "visible-image"; // Toggle display animations
    
    imgLabel.innerText = `Egg #${eggCount} (${grade})`;
    imgLabel.className = "viewer-tag"; 

    // Prepend neat row summary to history ledger table
    const row = `<tr>
        <td><strong>${time}</strong></td>
        <td>${weight}g</td>
        <td><span style="color: var(--accent); font-weight:600;">${grade}</span></td>
    </tr>`;
    tableBody.insertAdjacentHTML('afterbegin', row);
}

// Initializing background receiver routines
listenForHardwareData();
