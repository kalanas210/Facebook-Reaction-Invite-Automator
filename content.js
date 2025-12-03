// FB Reaction Invite Automator - Enhanced with safety features
let running = false;
let stopRequested = false;
let config = { 
  minDelay: 300, 
  maxDelay: 600, 
  perRun: 100, 
  dailyCap: 1000,
  sessionBreakAfter: 50,
  sessionBreakDuration: 180000, // 3 minutes
  scrollDelay: 800,
  enableScrolling: true,
  loadingWaitTime: 1000 // Base wait time for loading content (ms) - adjust for connection speed
};
let dailyCount = 0;
let runCount = 0;
let sessionCount = 0;
let lastActivityTime = Date.now();
let userInteracting = false;

// Load persistent daily count from storage
chrome.storage.local.get(['dailyCount', 'dailyDate'], (result) => {
  const today = new Date().toDateString();
  if (result.dailyDate === today) {
    dailyCount = result.dailyCount || 0;
    console.log(`Restored daily count: ${dailyCount}`);
  } else {
    // New day, reset
    dailyCount = 0;
    chrome.storage.local.set({ dailyCount: 0, dailyDate: today });
  }
});

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sleep(ms) { 
  return new Promise(r => setTimeout(r, ms)); 
}

// Helper function to find the reaction modal using multiple strategies
function findReactionModal() {
  // Strategy 1: Standard dialog role
  let modal = document.querySelector('[role="dialog"]');
  if (modal) {
    const text = modal.textContent || '';
    if (text.includes('Invite') || text.includes('Invited') || text.includes('reaction')) {
      return modal;
    }
  }
  
  // Strategy 2: Alternative dialog selectors
  const dialogSelectors = [
    'div[role="dialog"]',
    '[aria-labelledby*="reaction"]',
    'div[aria-modal="true"]',
    'div[data-pagelet*="Reactions"]',
  ];
  
  for (const selector of dialogSelectors) {
    const found = document.querySelector(selector);
    if (found) {
      const text = found.textContent || '';
      if (text.includes('Invite') || text.includes('Invited') || found.querySelector('button')) {
        return found;
      }
    }
  }
  
  // Strategy 3: Look for large fixed overlays that might be modals
  const allFixed = document.querySelectorAll('div[style*="position: fixed"], div[style*="position:fixed"]');
  for (const el of allFixed) {
    const rect = el.getBoundingClientRect();
    // Check if it's a substantial overlay (not just a small popup)
    if (rect.width > 400 && rect.height > 300) {
      const text = el.textContent || '';
      // Check if it contains invite buttons or reaction-related content
      if (text.includes('Invite') || text.includes('Invited') || 
          text.includes('Like') || text.includes('Love') ||
          el.querySelector('button[aria-label*="Invite"]') ||
          el.querySelector('button:has-text("Invite")')) {
        return el;
      }
    }
  }
  
  // Strategy 4: Look for elements with "Invite" buttons (might be the modal container)
  const allButtons = document.querySelectorAll('button, div[role="button"]');
  for (const btn of allButtons) {
    const txt = (btn.textContent || '').trim();
    if (txt === 'Invite' || /^Invite$/i.test(txt)) {
      // Found an invite button, check its container
      let container = btn.closest('div[role="dialog"]') || 
                      btn.closest('div[aria-modal="true"]') ||
                      btn.closest('div[style*="position: fixed"]');
      
      if (container) {
        const rect = container.getBoundingClientRect();
        if (rect.width > 300 && rect.height > 200) {
          return container;
        }
      }
    }
  }
  
  return null;
}

// Enhanced random delay with variation patterns (optimized for speed)
function getSmartDelay() {
  const base = randInt(config.minDelay, config.maxDelay);
  // Minimal progressive slowdown for speed
  const progressiveFactor = Math.min(sessionCount / 50, 1.2);
  const progressive = base * progressiveFactor;
  
  // Occasional small spike (reduced frequency and duration)
  if (Math.random() < 0.03) {
    return progressive + randInt(500, 1500);
  }
  
  return progressive;
}

// Simulate human mouse movement
function simulateMouseMovement() {
  const event = new MouseEvent('mousemove', {
    bubbles: true,
    cancelable: true,
    view: window,
    clientX: randInt(100, window.innerWidth - 100),
    clientY: randInt(100, window.innerHeight - 100)
  });
  document.dispatchEvent(event);
}

// Enhanced human-like click with hover delay
async function simulateHumanClick(el) {
  try {
    const rect = el.getBoundingClientRect();
    const clientX = rect.left + rect.width * (0.3 + Math.random() * 0.4);
    const clientY = rect.top + rect.height * (0.3 + Math.random() * 0.4);

    // Scroll element into view if needed (faster)
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    await sleep(randInt(50, 150));

    // Mouse approach (faster)
    el.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: clientX - 10, clientY: clientY - 10 }));
    await sleep(randInt(20, 80));
    
    // Hover (faster)
    el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, clientX, clientY }));
    el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true, clientX, clientY }));
    await sleep(randInt(50, 150));
    
    // Click (faster)
    el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX, clientY, button: 0 }));
    await sleep(randInt(20, 60));
    el.click();
    await sleep(randInt(15, 50));
    el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX, clientY, button: 0 }));
    
    return true;
  } catch (e) {
    console.warn('Click simulation error:', e);
    try {
      el.click();
      return true;
    } catch {
      return false;
    }
  }
}

// Find scrollable container for the invite modal
function findScrollableContainer() {
  const modal = findReactionModal();
  if (!modal) return null;
  
  // Try multiple selectors to find the scrollable list container
  const selectors = [
    '[role="dialog"] [role="list"]',
    '[role="dialog"] ul',
    '[role="dialog"] div[style*="overflow"]',
    '[role="dialog"] div[style*="overflow-y"]',
    '[role="dialog"] > div > div > div', // Common Facebook modal structure
    '[role="dialog"] div[tabindex="-1"]' // Scrollable divs often have tabindex
  ];
  
  for (const selector of selectors) {
    const containers = document.querySelectorAll(selector);
    for (const container of containers) {
      // Check if it's actually scrollable
      if (container && container.scrollHeight > container.clientHeight) {
        // Verify it contains invite buttons
        const hasInviteButtons = container.querySelector('button') || 
                                 container.textContent.includes('Invite') ||
                                 container.textContent.includes('Invited');
        if (hasInviteButtons) {
          return container;
        }
      }
    }
  }
  
  // Fallback: find any scrollable div in modal
  const allDivs = modal.querySelectorAll('div');
  for (const div of allDivs) {
    if (div.scrollHeight > div.clientHeight && div.scrollHeight > 300) {
      return div;
    }
  }
  
  return null;
}

// Close the reaction modal
async function closeModal() {
  try {
    // Look for close button (X) in the modal
    const closeButtons = [
      document.querySelector('[role="dialog"] [aria-label*="Close"], [aria-label*="close"]'),
      document.querySelector('[role="dialog"] button[aria-label*="Close"]'),
      document.querySelector('[role="dialog"] div[role="button"][aria-label*="Close"]'),
      document.querySelector('[role="dialog"] svg[aria-label*="Close"]')?.closest('button'),
      document.querySelector('[role="dialog"] svg[aria-label*="Close"]')?.closest('div[role="button"]')
    ];
    
    for (const btn of closeButtons) {
      if (btn && btn.offsetWidth > 0 && btn.offsetHeight > 0) {
        console.log('🔒 Closing modal...');
        await simulateHumanClick(btn);
        await sleep(randInt(500, 1000));
        return true;
      }
    }
    
    // Fallback: Press Escape key
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27, bubbles: true }));
    await sleep(randInt(500, 1000));
    return true;
  } catch (e) {
    console.warn('Error closing modal:', e);
    return false;
  }
}

// Get unique identifier for a post
function getPostId(postElement) {
  // Try multiple methods to get a unique ID
  const article = postElement.closest('article');
  if (article) {
    // Try data-ft or other attributes
    const dataFt = article.getAttribute('data-ft');
    if (dataFt) {
      try {
        const parsed = JSON.parse(dataFt);
        if (parsed.top_level_post_id) return parsed.top_level_post_id;
        if (parsed.page_id) return parsed.page_id;
      } catch {}
    }
    
    // Try aria-labelledby
    const ariaLabel = article.getAttribute('aria-labelledby');
    if (ariaLabel) return ariaLabel;
    
    // Try data-pagelet
    const pagelet = article.getAttribute('data-pagelet');
    if (pagelet) return pagelet;
    
    // Fallback: use article's position in DOM
    const articles = Array.from(document.querySelectorAll('article'));
    const index = articles.indexOf(article);
    return `post_${index}`;
  }
  return null;
}

// Find the reaction button/link for a post
function findPostReactionsButton(postElement) {
  if (!postElement) return null;
  
  const article = postElement.closest('article');
  if (!article) return null;
  
  // Look for reaction count links/buttons
  const selectors = [
    'a[href*="/reactions"]',
    'a[href*="/ufi/reaction"]',
    'span[role="button"]:has-text("reaction")',
    'div[role="button"]:has-text("reaction")',
    'a:has-text("reactions")',
    'a:has-text("likes")',
    'a:has-text("loves")',
    'a:has-text("haha")',
    'a:has-text("wow")',
    'a:has-text("sad")',
    'a:has-text("angry")'
  ];
  
  // Try to find reaction count text
  const allLinks = article.querySelectorAll('a, span[role="button"], div[role="button"]');
  
  for (const el of allLinks) {
    const text = (el.textContent || el.innerText || '').toLowerCase();
    const href = el.getAttribute('href') || '';
    
    // Check if it's a reaction link
    if (href.includes('/reactions') || href.includes('/ufi/reaction')) {
      return el;
    }
    
    // Check if text contains reaction keywords
    if (text.match(/\d+\s*(reactions?|likes?|loves?|haha|wow|sad|angry)/i)) {
      return el;
    }
    
    // Check for reaction count pattern (e.g., "1.2K", "500", etc.)
    if (text.match(/\d+[KMB]?\s*(reactions?|likes?)/i)) {
      return el;
    }
  }
  
  return null;
}

// Find next unprocessed post on the page
async function findNextPost() {
  console.log('🔍 Looking for next post...');
  
  // Get all posts (articles) on the page
  const articles = Array.from(document.querySelectorAll('article'));
  
  for (const article of articles) {
    const postId = getPostId(article);
    
    // Skip if already processed
    if (postId && processedPosts.has(postId)) {
      continue;
    }
    
    // Check if post has reactions
    const reactionsBtn = findPostReactionsButton(article);
    if (reactionsBtn && reactionsBtn.offsetWidth > 0 && reactionsBtn.offsetHeight > 0) {
      // Check if it's visible in viewport
      const rect = reactionsBtn.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        return { element: reactionsBtn, postId, article };
      }
    }
  }
  
  return null;
}

// Scroll to find more posts
async function scrollToFindMorePosts() {
  console.log('📜 Scrolling to find more posts...');
  
  const scrollAmount = randInt(400, 800);
  const currentScroll = window.scrollY;
  
  // Smooth scroll
  window.scrollBy({ top: scrollAmount, behavior: 'smooth' });
  await sleep(randInt(1500, 2500));
  
  return window.scrollY > currentScroll;
}

// Process a single post completely
async function processPost(reactionsButton, postId) {
  console.log(`📝 Processing post: ${postId}`);
  currentPostId = postId;
  processedPosts.add(postId);
  
  let modalOpened = false;
  
  // Check if modal is already open
  const existingModal = document.querySelector('[role="dialog"]');
  if (existingModal && existingModal.offsetWidth > 0) {
    console.log('✅ Modal already open, using existing modal...');
    modalOpened = true;
  } else if (reactionsButton) {
    // Click on reactions to open modal
    console.log('🖱️ Clicking reactions button...');
    const clicked = await simulateHumanClick(reactionsButton);
    if (!clicked) {
      console.warn('⚠️ Failed to click reactions button');
      return false;
    }
    
    // Wait for modal to open
    console.log('⏳ Waiting for modal to open...');
    for (let i = 0; i < 20; i++) {
      await sleep(randInt(200, 400));
      const modal = document.querySelector('[role="dialog"]');
      if (modal && modal.offsetWidth > 0) {
        modalOpened = true;
        break;
      }
    }
  }
  
  if (!modalOpened) {
    console.warn('⚠️ Modal did not open');
    return false;
  }
  
  console.log('✅ Modal opened, starting invites...');
  await sleep(randInt(500, 1000));
  
  // Process all invites for this post
  let consecutiveNoButtons = 0;
  let lastScrollTime = 0;
  let invitesForThisPost = 0;
  
  while (!stopRequested) {
    // Check daily cap
    if (dailyCount >= config.dailyCap) {
      console.warn('🛑 Daily cap reached:', dailyCount);
      chrome.runtime.sendMessage({ type: 'status', text: 'daily_limit_reached' });
      await closeModal();
      return false;
    }
    
    // Check per-run limit
    if (runCount >= config.perRun) {
      console.log('✅ Per-run limit reached:', runCount);
      await closeModal();
      return false;
    }
    
    // Session break logic
    if (sessionCount >= config.sessionBreakAfter) {
      const breakTime = config.sessionBreakDuration;
      console.log(`☕ Taking session break for ${breakTime / 1000}s...`);
      chrome.runtime.sendMessage({ type: 'status', text: 'session_break' });
      await sleep(breakTime);
      sessionCount = 0;
    }
    
    // Find invite buttons
    const buttons = findInviteButtons();
    
    if (!buttons.length) {
      consecutiveNoButtons++;
      
      // Try scrolling within modal to load more
      if (consecutiveNoButtons <= 3 && Date.now() - lastScrollTime > 2000 && config.enableScrolling) {
        console.log('📜 Scrolling modal to load more invites...');
        const scrolled = await scrollToLoadMore();
        lastScrollTime = Date.now();
        
        if (scrolled) {
          consecutiveNoButtons = 0;
          await sleep(randInt(1000, 2000));
          continue;
        }
      }
      
      // No more buttons found after scrolling attempts
      if (consecutiveNoButtons >= 5) {
        console.log(`✅ Finished post ${postId} - sent ${invitesForThisPost} invites`);
        await closeModal();
        await sleep(randInt(1000, 2000));
        return true; // Successfully completed this post
      }
      
      await sleep(randInt(1000, 2000));
      continue;
    }
    
    consecutiveNoButtons = 0;
    
    // Pick a button
    let btn;
    if (Math.random() < 0.15) {
      btn = buttons[randInt(0, Math.min(buttons.length - 1, 3))];
    } else {
      btn = buttons[0];
    }
    
    // Occasionally skip
    if (Math.random() < 0.03) {
      console.log('⏭️ Randomly skipping an invite');
      await sleep(randInt(400, 1000));
      continue;
    }
    
    // Random mouse movement
    if (Math.random() < 0.2) {
      simulateMouseMovement();
      await sleep(randInt(100, 300));
    }
    
    // Click the button
    const clicked = await simulateHumanClick(btn);
    
    if (clicked) {
      runCount++;
      sessionCount++;
      dailyCount++;
      invitesForThisPost++;
      
      console.log(`✔️ Invite sent: #${runCount} (post: ${postId}, daily: ${dailyCount})`);
      
      // Update progress every 10 invites
      if (runCount % 10 === 0) {
        await updateProgress();
      }
      
      // Smart delay
      const delay = getSmartDelay();
      await sleep(delay);
      
      // Small pause occasionally (reduced for speed)
      if (Math.random() < 0.02) {
        const extraPause = randInt(1000, 3000);
        console.log(`💤 Taking brief pause: ${extraPause / 1000}s`);
        await sleep(extraPause);
      }
    } else {
      console.warn('⚠️ Failed to click button, waiting...');
      await sleep(randInt(500, 1000));
    }
  }
  
  await closeModal();
  return false; // Stopped by user
}

// Smooth scroll to load more invites within the modal
async function scrollToLoadMore() {
  if (!config.enableScrolling) return false;
  
  const container = findScrollableContainer();
  if (!container) {
    console.warn('⚠️ Could not find scrollable container');
    return false;
  }
  
  const currentScroll = container.scrollTop;
  const maxScroll = container.scrollHeight - container.clientHeight;
  
  // If already at bottom, can't scroll more
  if (currentScroll >= maxScroll - 10) {
    console.log('📜 Already at bottom of modal');
    return false;
  }
  
  // Scroll down within the modal
  const scrollAmount = randInt(300, 600);
  const targetScroll = Math.min(currentScroll + scrollAmount, maxScroll);
  
  // Smooth scroll simulation (multiple small scrolls for human-like behavior)
  const steps = randInt(4, 8);
  const stepSize = (targetScroll - currentScroll) / steps;
  
  for (let i = 0; i < steps; i++) {
    container.scrollTop = currentScroll + (stepSize * (i + 1));
    await sleep(randInt(80, 150));
  }
  
  // Wait for new content to load (user-configurable)
  const baseScrollWait = config.scrollDelay + (config.loadingWaitTime * 0.3);
  const scrollWait = randInt(baseScrollWait * 0.8, baseScrollWait * 1.2);
  await sleep(scrollWait);
  
  const newScroll = container.scrollTop;
  const scrolled = newScroll > currentScroll;
  
  if (scrolled) {
    console.log(`📜 Scrolled modal: ${currentScroll} → ${newScroll} (waited ${scrollWait}ms)`);
  }
  
  return scrolled;
}

// Find invite buttons with better detection - only in the modal
function findInviteButtons() {
  // Use helper function to find modal
  const modal = findReactionModal();
  
  if (!modal) {
    console.log('⚠️ No modal found');
    return [];
  }
  
  console.log('🔍 Searching for invite buttons in modal...');
  
  // Search for all possible button-like elements
  const allButtons = modal.querySelectorAll('button, div[role="button"], span[role="button"], a[role="button"], div[tabindex="0"]');
  
  console.log(`📊 Found ${allButtons.length} total button-like elements`);
  
  const buttons = [];
  
  for (const b of allButtons) {
    // Get text from button and its children
    const txt = (b.innerText || b.textContent || '').trim();
    
    // Also check for text in child spans/divs (Facebook often nests text)
    const childText = Array.from(b.querySelectorAll('span, div')).map(el => el.textContent || '').join(' ').trim();
    const fullText = (txt + ' ' + childText).trim();
    
    // Multi-language support - look for "Invite" text (not just exact match)
    const inviteRegex = /\b(Invite|Invitar|Convidar|Inviter|Einladen|Invita)\b/i;
    const isInvite = inviteRegex.test(fullText);
    const isInvited = /\b(Invited|Invitado|Convidado|Invité|Eingeladen)\b/i.test(fullText);
    
    // Skip if it says "Invited" (already done)
    if (isInvited && !isInvite) {
      continue;
    }
    
    // Must contain "Invite" text
    if (!isInvite) {
      continue;
    }
    
    // Check if disabled
    if (b.disabled || b.getAttribute('aria-disabled') === 'true') {
      continue;
    }
    
    // Check visibility
    if (!(b.offsetWidth > 0 && b.offsetHeight > 0)) {
      continue;
    }
    
    // Check computed style
    try {
      const style = window.getComputedStyle(b);
      if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) < 0.1) {
        continue;
      }
    } catch (e) {
      // Style check failed, continue anyway
    }
    
    // Check if parent row indicates already invited
    const parent = b.closest('div[role="listitem"], li, div[data-testid], div[style*="display"]');
    if (parent) {
      const parentText = (parent.textContent || '').toLowerCase();
      // If parent clearly shows "Invited" status, skip
      if (parentText.includes('invited') && !parentText.includes('invite') && !isInvite) {
        continue;
      }
    }
    
    // Additional check: make sure it's not a close button or other UI element
    const ariaLabel = (b.getAttribute('aria-label') || '').toLowerCase();
    if (ariaLabel.includes('close') || ariaLabel.includes('cancel') || ariaLabel.includes('done')) {
      continue;
    }
    
    buttons.push(b);
  }
  
  console.log(`✅ Found ${buttons.length} valid invite buttons`);
  
  // Debug: log first few button texts if found
  if (buttons.length > 0) {
    console.log('📝 Sample button texts:', buttons.slice(0, 3).map(b => (b.textContent || b.innerText || '').trim()));
  } else {
    // Debug: show what buttons we found but filtered out
    const sampleButtons = Array.from(allButtons).slice(0, 10);
    console.log('🔍 Sample button texts found (filtered out):', 
      sampleButtons.map(b => (b.textContent || b.innerText || '').trim()).filter(t => t));
  }
  
  return buttons;
}

// Update status and save progress
async function updateProgress() {
  // Save daily count
  const today = new Date().toDateString();
  await chrome.storage.local.set({ 
    dailyCount: dailyCount, 
    dailyDate: today 
  });
  
  // Send status update
  chrome.runtime.sendMessage({ 
    type: 'progress', 
    data: { 
      runCount, 
      sessionCount, 
      dailyCount,
      running 
    } 
  });
}

// Main automation queue - works with the currently open modal
async function runQueue() {
  if (running) return;
  running = true;
  stopRequested = false;
  runCount = 0;
  sessionCount = 0;
  
  console.log('🚀 Starting invite automation...');
  chrome.runtime.sendMessage({ type: 'status', text: 'running' });
  
  // Check if modal is open using helper function
  let modal = findReactionModal();
  
  if (!modal || modal.offsetWidth === 0) {
    console.warn('⚠️ No reaction modal found!');
    console.warn('💡 Debugging info:');
    
    // Debug: show what dialogs exist
    const dialogs = document.querySelectorAll('[role="dialog"], div[aria-modal="true"]');
    console.log(`   Found ${dialogs.length} dialog elements on page`);
    
    // Debug: show if any invite buttons exist anywhere
    const allInviteBtns = Array.from(document.querySelectorAll('button, div[role="button"]'))
      .filter(b => /Invite/i.test(b.textContent || ''));
    console.log(`   Found ${allInviteBtns.length} "Invite" buttons on page`);
    
    if (allInviteBtns.length > 0) {
      console.warn('   ⚠️ Invite buttons found but modal not detected!');
      console.warn('   💡 Try: Refresh the page and open the reactions modal again');
    } else {
      console.warn('   💡 Make sure you click on the reactions (likes/loves) to open the modal');
    }
    
    chrome.runtime.sendMessage({ type: 'status', text: 'no_modal' });
    running = false;
    return;
  }
  
  console.log('✅ Modal found!', {
    width: modal.offsetWidth,
    height: modal.offsetHeight,
    hasInviteText: (modal.textContent || '').includes('Invite')
  });
  
  console.log('✅ Modal detected, waiting for modal to fully load...');
  
  // Wait for modal content to load (user-configurable)
  const initialWait = randInt(config.loadingWaitTime * 0.5, config.loadingWaitTime);
  await sleep(initialWait);
  
  // Initial button check with multiple retries (user-configurable)
  let initialButtons = findInviteButtons();
  let retryCount = 0;
  const maxRetries = Math.max(3, Math.ceil(config.loadingWaitTime / 500)); // More retries for slower connections
  
  while (initialButtons.length === 0 && retryCount < maxRetries) {
    retryCount++;
    const baseWait = config.loadingWaitTime + (retryCount * (config.loadingWaitTime * 0.3));
    const waitTime = randInt(baseWait * 0.8, baseWait * 1.2);
    console.log(`⏳ No buttons found (attempt ${retryCount}/${maxRetries}), waiting ${waitTime/1000}s for content to load...`);
    chrome.runtime.sendMessage({ type: 'status', text: 'loading' });
    await sleep(waitTime);
    initialButtons = findInviteButtons();
  }
  
  if (initialButtons.length === 0) {
    console.warn('⚠️ No invite buttons found after multiple attempts. Make sure:');
    console.warn('   1. The modal is fully loaded');
    console.warn('   2. There are users with "Invite" buttons visible');
    console.warn('   3. You have permission to invite users');
    console.warn('   4. Your internet connection is stable');
    chrome.runtime.sendMessage({ type: 'status', text: 'no_buttons' });
    running = false;
    return;
  }
  
  console.log(`✅ Found ${initialButtons.length} invite buttons after ${retryCount + 1} attempt(s)`);
  
  console.log(`✅ Found ${initialButtons.length} invite buttons, starting automation...`);
  
  let consecutiveNoButtons = 0;
  let lastScrollTime = 0;
  let lastButtonCount = 0;
  let noProgressCount = 0;
  
  // Main loop: process all invites in the current modal
  while (!stopRequested) {
    // Check if modal is still open using helper function
    modal = findReactionModal();
    
    if (!modal || modal.offsetWidth === 0) {
      console.log('⚠️ Modal was closed');
      break;
    }
    
    // Check if user is interacting
    if (userInteracting) {
      console.log('⏸️ User activity detected, pausing...');
      await sleep(randInt(3000, 8000));
      userInteracting = false;
      continue;
    }
    
    // Check daily cap
    if (dailyCount >= config.dailyCap) {
      console.warn('🛑 Daily cap reached:', dailyCount);
      chrome.runtime.sendMessage({ type: 'status', text: 'daily_limit_reached' });
      break;
    }
    
    // Check per-run limit
    if (runCount >= config.perRun) {
      console.log('✅ Per-run limit reached:', runCount);
      break;
    }
    
    // Session break logic
    if (sessionCount >= config.sessionBreakAfter) {
      const breakTime = config.sessionBreakDuration;
      console.log(`☕ Taking session break for ${breakTime / 1000}s...`);
      chrome.runtime.sendMessage({ type: 'status', text: 'session_break' });
      await sleep(breakTime);
      sessionCount = 0;
    }
    
    // Find available invite buttons
    const buttons = findInviteButtons();
    
    if (!buttons.length) {
      consecutiveNoButtons++;
      
      // Try scrolling within modal to load more (faster)
      if (consecutiveNoButtons <= 6 && Date.now() - lastScrollTime > 1000 && config.enableScrolling) {
        console.log(`📜 Scrolling modal to load more invites... (attempt ${consecutiveNoButtons})`);
        const scrolled = await scrollToLoadMore();
        lastScrollTime = Date.now();
        
        if (scrolled) {
          // Wait after scrolling (user-configurable)
          const baseWait = config.loadingWaitTime + (consecutiveNoButtons * (config.loadingWaitTime * 0.2));
          const waitAfterScroll = randInt(baseWait * 0.8, baseWait * 1.2);
          console.log(`⏳ Waiting ${waitAfterScroll/1000}s for new content to load...`);
          await sleep(waitAfterScroll);
          
          // Check again after waiting
          const buttonsAfterScroll = findInviteButtons();
          if (buttonsAfterScroll.length > 0) {
            consecutiveNoButtons = 0;
            noProgressCount = 0;
            continue; // Found buttons, process them
          }
          // If still no buttons, continue to next check
        }
      }
      
      // Check if we're making progress
      if (buttons.length === lastButtonCount && buttons.length === 0) {
        noProgressCount++;
      } else {
        noProgressCount = 0;
      }
      lastButtonCount = buttons.length;
      
      // Progressive waiting: user-configurable based on connection speed
      const baseWait = config.loadingWaitTime + (consecutiveNoButtons * (config.loadingWaitTime * 0.3));
      const waitTime = randInt(baseWait * 0.8, baseWait * 1.2);
      
      // No buttons found after attempts (adjustable threshold based on wait time)
      const maxAttempts = Math.max(10, Math.ceil(config.loadingWaitTime / 200));
      const maxNoProgress = Math.max(7, Math.ceil(config.loadingWaitTime / 300));
      
      if (consecutiveNoButtons >= maxAttempts || noProgressCount >= maxNoProgress) {
        console.log('✅ No more invite buttons found in modal');
        console.log(`   (Checked ${consecutiveNoButtons} times)`);
        break;
      }
      
      if (consecutiveNoButtons > 3) {
        console.log(`⏳ No buttons found, waiting ${waitTime/1000}s before retry...`);
      }
      
      await sleep(waitTime);
      continue;
    }
    
    consecutiveNoButtons = 0;
    noProgressCount = 0;
    
    // Pick a button (usually first, but occasionally random for variety)
    let btn;
    if (Math.random() < 0.15) {
      // Pick random button occasionally
      btn = buttons[randInt(0, Math.min(buttons.length - 1, 5))];
    } else {
      btn = buttons[0];
    }
    
    // Occasionally skip (reduced for speed)
    if (Math.random() < 0.01) {
      console.log('⏭️ Randomly skipping an invite');
      await sleep(randInt(200, 500));
      continue;
    }
    
    // Random mouse movement before click (reduced frequency for speed)
    if (Math.random() < 0.1) {
      simulateMouseMovement();
      await sleep(randInt(50, 150));
    }
    
    // Click the button
    const clicked = await simulateHumanClick(btn);
    
    if (clicked) {
      runCount++;
      sessionCount++;
      dailyCount++;
      
      console.log(`✔️ Invite sent: #${runCount} (session: ${sessionCount}, daily: ${dailyCount})`);
      
      // Update progress every 10 invites
      if (runCount % 10 === 0) {
        await updateProgress();
      }
      
      // Smart delay between clicks
      const delay = getSmartDelay();
      await sleep(delay);
      
      // Small pause occasionally (reduced for speed)
      if (Math.random() < 0.02) {
        const extraPause = randInt(1000, 3000);
        console.log(`💤 Taking brief pause: ${extraPause / 1000}s`);
        await sleep(extraPause);
      }
    } else {
      console.warn('⚠️ Failed to click button, waiting...');
      await sleep(randInt(500, 1000));
    }
  }
  
  running = false;
  await updateProgress();
  
  const finalStatus = stopRequested ? 'stopped' : 'completed';
  console.log(`🏁 Automation ${finalStatus}. Total sent: ${runCount} invites`);
  chrome.runtime.sendMessage({ type: 'status', text: finalStatus });
}

// Detect user interaction
let activityTimer;
['mousedown', 'keydown', 'wheel'].forEach(event => {
  document.addEventListener(event, () => {
    if (running) {
      userInteracting = true;
      clearTimeout(activityTimer);
      activityTimer = setTimeout(() => {
        userInteracting = false;
      }, 2000);
    }
  }, true);
});

// Message listener
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'start') {
    config = Object.assign(config, msg.config || {});
    stopRequested = false;
    runQueue();
    sendResponse({ success: true });
  } else if (msg.action === 'stop') {
    stopRequested = true;
    sendResponse({ success: true });
  } else if (msg.action === 'getStatus') {
    sendResponse({ 
      running, 
      runCount, 
      sessionCount, 
      dailyCount,
      config 
    });
  }
  return true; // Keep channel open for async response
});

// DOM observer for modal detection
const observer = new MutationObserver((mutations) => {
  // Don't auto-start, wait for user command
  lastActivityTime = Date.now();
});

observer.observe(document.body, { childList: true, subtree: true });

console.log('✨ FB Invite Automator loaded and ready!');
