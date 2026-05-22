
async function listenForHardwareData() {
    try {
        const response = await fetch('http://localhost:8001/stream');
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            
            const rawData = decoder.decode(value);
            const egg = JSON.parse(rawData);
            
            updateDashboardWithRealData(egg.weight, egg.image_data);
        }
    } catch (error) {
        console.log("Waiting for local server connection...");
        // Retry connection automatically every 2 seconds if the Python script isn't running yet
        setTimeout(listenForHardwareData, 2000); 
    }
}

let totalWeight = 0;
let eggCount = 0;

function updateDashboardWithRealData(weight, base64Image) {
    const tableBody = document.getElementById('table-body');
    const time = new Date().toLocaleTimeString();
    
    // Quality Grading Logic (Insights component)
    let grade = "Medium";
    if (weight > 62) grade = "Large";
    if (weight < 53) grade = "Small";

    // Recompute total aggregations
    eggCount++;
    totalWeight += parseFloat(weight);
    document.getElementById('total-count').innerText = eggCount;
    document.getElementById('avg-weight').innerText = (totalWeight / eggCount).toFixed(1) + "g";

    // Insert a fresh row at the very top of the feed containing the tracking variables and base64 image data
    const row = `<tr>
        <td>${time}</td>
        <td>${weight}g</td>
        <td>${grade}</td>
        <td><img src="data:image/jpeg;base64,${base64Image}" style="width:80px; height:60px; border-radius:4px; object-fit:cover; border: 1px solid #ccc;"/></td>
    </tr>`;
    tableBody.insertAdjacentHTML('afterbegin', row);
}

// Fire up the local bridge connection routine immediately
listenForHardwareData();
