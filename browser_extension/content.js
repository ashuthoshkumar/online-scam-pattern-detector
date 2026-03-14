
// ── CONTENT SCRIPT ───────────────────────────────────────
// Runs on every webpage and extracts text content

// Trusted websites - never scan these
const TRUSTED_SITES = [
  'claude.ai',
  'anthropic.com',
  'google.com',
  'youtube.com',
  'facebook.com',
  'instagram.com',
  'twitter.com',
  'linkedin.com',
  'github.com',
  'microsoft.com',
  'amazon.com',
  'flipkart.com',
  'naukri.com',
  'irctc.co.in',
  '127.0.0.1',
  'localhost'
];

// Stop immediately if trusted site
const currentHost = window.location.hostname;
if (TRUSTED_SITES.some(site => currentHost.includes(site))) {
  // Don't scan this page
  throw new Error('Trusted site - skipping scan');
}

function extractPageContent() {
    // Get page URL
    const url = window.location.href;

    // Get visible text from page
    const bodyText = document.body.innerText || '';

    // Get all links on page
    const links = Array.from(document.querySelectorAll('a'))
        .map(a => a.href)
        .filter(href => href.startsWith('http'))
        .slice(0, 10);

    // Get page title
    const title = document.title || '';

    return {
        url: url,
        title: title,
        text: bodyText.slice(0, 1000),
        links: links
    };
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'getPageContent') {
        const content = extractPageContent();
        sendResponse(content);
    }
    return true;
});

// Auto scan page for scam indicators
function autoScanPage() {
    const scamKeywords = [
        'congratulations you won',
        'click here to claim',
        'verify your otp',
        'bank account suspended',
        'urgent action required',
        'free iphone',
        'lottery winner',
        'send otp',
        'claim your prize',
        'work from home earn'
    ];

    const pageText = document.body.innerText.toLowerCase();
    let scamCount = 0;

    scamKeywords.forEach(keyword => {
        if (pageText.includes(keyword)) {
            scamCount++;
        }
    });

    // If multiple scam keywords found show warning banner
    if (scamCount >= 2) {
        showWarningBanner(scamCount);
    }
}

function showWarningBanner(count) {
    // Don't show on localhost
    if (window.location.hostname === '127.0.0.1' ||
        window.location.hostname === 'localhost') {
        return;
    }

    // Create warning banner
    const banner = document.createElement('div');
    banner.id = 'scamDetectorBanner';
    banner.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #ff416c, #ff4b2b);
            color: white;
            padding: 12px 20px;
            text-align: center;
            font-family: Arial, sans-serif;
            font-size: 15px;
            font-weight: bold;
            z-index: 999999;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
        ">
            ⚠️ SCAM DETECTOR WARNING: This page contains
            ${count} suspicious scam indicators!
            Be careful — do NOT share personal information!
            <button onclick="document.getElementById('scamDetectorBanner').remove()"
                style="
                    background: rgba(255,255,255,0.3);
                    border: none;
                    color: white;
                    padding: 5px 15px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-weight: bold;
                ">
                Dismiss ✕
            </button>
        </div>
    `;
    document.body.prepend(banner);
}

// Run auto scan when page loads
window.addEventListener('load', function() {
    setTimeout(autoScanPage, 1500);
});