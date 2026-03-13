const API_URL = 'http://127.0.0.1:5000';

// ── SCAN CURRENT PAGE ────────────────────────────────────
async function scanCurrentPage() {
    const resultDiv = document.getElementById('scanResult');
    const btn = document.getElementById('scanPageBtn');

    resultDiv.style.display = 'block';
    resultDiv.className = 'result-loading';
    resultDiv.innerHTML = '⏳ Scanning page...';
    btn.disabled = true;

    try {
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });

        const pageContent = await chrome.tabs.sendMessage(
            tab.id,
            {action: 'getPageContent'}
        );

        const response = await fetch(`${API_URL}/extension/scan-page`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                url: pageContent.url,
                text: pageContent.text,
                title: pageContent.title
            })
        });

        const data = await response.json();

        if (data.result === 'SCAM') {
            resultDiv.className = 'result-scam';
            resultDiv.innerHTML = `
                ⚠️ <strong>SCAM DETECTED!</strong><br>
                Confidence: ${data.confidence}%<br>
                <small>${data.reason}</small>
            `;
        } else {
            resultDiv.className = 'result-safe';
            resultDiv.innerHTML = `
                ✅ <strong>PAGE APPEARS SAFE</strong><br>
                Confidence: ${data.confidence}%<br>
                <small>No major scam indicators found</small>
            `;
        }

    } catch (error) {
        resultDiv.className = 'result-scam';
        resultDiv.innerHTML = `
            ❌ <strong>Error scanning page</strong><br>
            <small>Make sure your Scam Detector
            app is running at localhost:5000</small>
        `;
    }

    btn.disabled = false;
}

// ── SCAN TEXT MESSAGE ────────────────────────────────────
async function scanMessage() {
    const message = document.getElementById('messageInput').value.trim();
    const resultDiv = document.getElementById('textResult');

    if (!message) {
        resultDiv.style.display = 'block';
        resultDiv.className = 'result-loading';
        resultDiv.innerHTML = '⚠️ Please enter a message first!';
        return;
    }

    resultDiv.style.display = 'block';
    resultDiv.className = 'result-loading';
    resultDiv.innerHTML = '⏳ Analyzing message...';

    try {
        const response = await fetch(`${API_URL}/extension/scan-message`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({message: message})
        });

        const data = await response.json();

        if (data.result === 'SCAM') {
            resultDiv.className = 'result-scam';
            resultDiv.innerHTML = `
                ⚠️ <strong>SCAM DETECTED!</strong><br>
                Confidence: ${data.confidence}%
            `;
        } else {
            resultDiv.className = 'result-safe';
            resultDiv.innerHTML = `
                ✅ <strong>LEGITIMATE MESSAGE</strong><br>
                Confidence: ${data.confidence}%
            `;
        }

    } catch (error) {
        resultDiv.className = 'result-scam';
        resultDiv.innerHTML = `
            ❌ Error! Make sure your app
            is running at localhost:5000
        `;
    }
}

// ── ATTACH BUTTON EVENTS ─────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('scanPageBtn')
            .addEventListener('click', scanCurrentPage);
    document.getElementById('checkMsgBtn')
            .addEventListener('click', scanMessage);
});