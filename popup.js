// UI Elements
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const statusEl = document.getElementById('status');
const runCountEl = document.getElementById('runCount');
const sessionCountEl = document.getElementById('sessionCount');
const dailyCountEl = document.getElementById('dailyCount');

// Load saved settings
chrome.storage.local.get([
  'minDelay', 'maxDelay', 'perRun', 'dailyCap',
  'sessionBreakAfter', 'sessionBreakDuration', 'enableScrolling'
], (result) => {
  if (result.minDelay) document.getElementById('minDelay').value = result.minDelay;
  if (result.maxDelay) document.getElementById('maxDelay').value = result.maxDelay;
  if (result.perRun) document.getElementById('perRun').value = result.perRun;
  if (result.dailyCap) document.getElementById('dailyCap').value = result.dailyCap;
  if (result.sessionBreakAfter) document.getElementById('sessionBreakAfter').value = result.sessionBreakAfter;
  if (result.sessionBreakDuration) document.getElementById('sessionBreakDuration').value = result.sessionBreakDuration;
  if (result.enableScrolling !== undefined) document.getElementById('enableScrolling').checked = result.enableScrolling;
});

// Get current status from content script
async function updateStatus() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return;
    
    // Check if tab is Facebook
    if (!tab.url.includes('facebook.com')) {
      statusEl.textContent = 'Not on Facebook';
      statusEl.style.color = '#f56565';
      return;
    }
    
    chrome.tabs.sendMessage(tab.id, { action: 'getStatus' }, (response) => {
      if (chrome.runtime.lastError) {
        console.log('Content script not ready');
        return;
      }
      
      if (response) {
        updateUIWithStatus(response);
      }
    });
  } catch (e) {
    console.error('Status update error:', e);
  }
}

function updateUIWithStatus(status) {
  if (status.running) {
    startBtn.disabled = true;
    stopBtn.disabled = false;
    statusEl.textContent = 'Running ⚡';
    statusEl.style.color = '#48bb78';
  } else {
    startBtn.disabled = false;
    stopBtn.disabled = true;
  }
  
  runCountEl.textContent = status.runCount || 0;
  sessionCountEl.textContent = status.sessionCount || 0;
  dailyCountEl.textContent = status.dailyCount || 0;
}

// Start automation
startBtn.addEventListener('click', async () => {
  const config = {
    minDelay: Number(document.getElementById('minDelay').value) || 800,
    maxDelay: Number(document.getElementById('maxDelay').value) || 2200,
    perRun: Number(document.getElementById('perRun').value) || 100,
    dailyCap: Number(document.getElementById('dailyCap').value) || 1000,
    sessionBreakAfter: Number(document.getElementById('sessionBreakAfter').value) || 50,
    sessionBreakDuration: Number(document.getElementById('sessionBreakDuration').value) * 1000, // convert to ms
    enableScrolling: document.getElementById('enableScrolling').checked
  };
  
  // Validate config
  if (config.minDelay >= config.maxDelay) {
    alert('Max delay must be greater than min delay');
    return;
  }
  
  if (config.perRun > config.dailyCap) {
    alert('Per-run limit cannot exceed daily cap');
    return;
  }
  
  // Save settings
  chrome.storage.local.set({
    minDelay: config.minDelay,
    maxDelay: config.maxDelay,
    perRun: config.perRun,
    dailyCap: config.dailyCap,
    sessionBreakAfter: config.sessionBreakAfter,
    sessionBreakDuration: config.sessionBreakDuration / 1000,
    enableScrolling: config.enableScrolling
  });
  
  // Send to content script
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) {
      alert('No active tab found');
      return;
    }
    
    if (!tab.url.includes('facebook.com')) {
      alert('Please open this on a Facebook page');
      return;
    }
    
    chrome.tabs.sendMessage(tab.id, { action: 'start', config }, (response) => {
      if (chrome.runtime.lastError) {
        alert('Error: Please refresh the Facebook page and try again');
        return;
      }
      
      if (response && response.success) {
        startBtn.disabled = true;
        stopBtn.disabled = false;
        statusEl.textContent = 'Running ⚡';
        statusEl.style.color = '#48bb78';
      }
    });
  } catch (e) {
    alert('Error starting automation: ' + e.message);
  }
});

// Stop automation
stopBtn.addEventListener('click', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return;
    
    chrome.tabs.sendMessage(tab.id, { action: 'stop' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Stop error:', chrome.runtime.lastError);
      }
      
      startBtn.disabled = false;
      stopBtn.disabled = true;
      statusEl.textContent = 'Stopped 🛑';
      statusEl.style.color = '#f56565';
    });
  } catch (e) {
    console.error('Stop error:', e);
  }
});

// Listen for status updates from content script
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'status') {
    const statusText = msg.text;
    
    switch(statusText) {
      case 'running':
        statusEl.textContent = 'Running ⚡';
        statusEl.style.color = '#48bb78';
        startBtn.disabled = true;
        stopBtn.disabled = false;
        break;
      case 'stopped':
        statusEl.textContent = 'Stopped 🛑';
        statusEl.style.color = '#f56565';
        startBtn.disabled = false;
        stopBtn.disabled = true;
        break;
      case 'completed':
        statusEl.textContent = 'Completed ✅';
        statusEl.style.color = '#5a67d8';
        startBtn.disabled = false;
        stopBtn.disabled = true;
        break;
      case 'daily_limit_reached':
        statusEl.textContent = 'Daily Limit 🚫';
        statusEl.style.color = '#f56565';
        startBtn.disabled = true;
        stopBtn.disabled = true;
        break;
      case 'session_break':
        statusEl.textContent = 'Break Time ☕';
        statusEl.style.color = '#ed8936';
        break;
      case 'loading':
        statusEl.textContent = 'Loading... ⏳';
        statusEl.style.color = '#5a67d8';
        break;
      case 'no_modal':
        statusEl.textContent = 'No Modal Found ⚠️';
        statusEl.style.color = '#f56565';
        startBtn.disabled = false;
        stopBtn.disabled = true;
        break;
      case 'no_buttons':
        statusEl.textContent = 'No Buttons Found ⚠️';
        statusEl.style.color = '#f56565';
        startBtn.disabled = false;
        stopBtn.disabled = true;
        break;
      default:
        statusEl.textContent = statusText;
    }
  } else if (msg.type === 'progress') {
    const data = msg.data;
    runCountEl.textContent = data.runCount || 0;
    sessionCountEl.textContent = data.sessionCount || 0;
    dailyCountEl.textContent = data.dailyCount || 0;
    
    if (!data.running) {
      startBtn.disabled = false;
      stopBtn.disabled = true;
    }
  }
});

// Initial status check
updateStatus();

// Periodic status refresh
setInterval(updateStatus, 2000);
