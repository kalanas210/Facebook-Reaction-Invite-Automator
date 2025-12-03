// Background service worker for FB Invite Automator
console.log('FB Invite Automator background service started');

// Initialize storage on install
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed/updated');
  
  // Set default values if not exist
  chrome.storage.local.get(['dailyDate', 'dailyCount'], (result) => {
    if (!result.dailyDate) {
      chrome.storage.local.set({
        dailyDate: new Date().toDateString(),
        dailyCount: 0
      });
    }
  });
});

// Handle messages between popup and content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Log for debugging
  if (message.type === 'progress') {
    console.log('Progress update:', message.data);
  } else if (message.type === 'status') {
    console.log('Status update:', message.text);
  }
  
  // Broadcast to all listeners (popup, content scripts, etc.)
  return true;
});

// Daily reset check
chrome.alarms.create('dailyReset', { periodInMinutes: 60 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'dailyReset') {
    chrome.storage.local.get(['dailyDate'], (result) => {
      const today = new Date().toDateString();
      if (result.dailyDate !== today) {
        console.log('Resetting daily count for new day');
        chrome.storage.local.set({
          dailyDate: today,
          dailyCount: 0
        });
      }
    });
  }
});
