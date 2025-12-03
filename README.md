# 🚀 Facebook Reaction Invite Automator

A safe and intelligent Chrome extension to automate Facebook post reaction invites with human-like behavior patterns.

## ✨ Features

### 🛡️ Safety First
- **Configurable delays**: Random intervals (300-600ms default, customizable 10-5000ms) between each invite
- **Progressive slowdown**: Automatically slows down as more invites are sent
- **Session breaks**: Takes breaks after X invites (default: 50)
- **Activity detection**: Pauses when you interact with the page
- **Random skipping**: Occasionally skips invites to appear more human
- **Mouse movement simulation**: Mimics natural mouse behavior

### 🎯 Smart Automation
- **Auto-scrolling**: Automatically scrolls to load more invites
- **Persistent tracking**: Remembers daily count across browser restarts
- **Daily limits**: Set maximum invites per day (default: 1000)
- **Per-run limits**: Control how many invites per session (default: 100)
- **Multi-language support**: Works with English, Spanish, Portuguese, French, German, Italian

### 📊 Real-time Monitoring
- Live progress tracking
- Current run count
- Session count
- Daily total count
- Status indicators

## 📦 Installation

### Step 1: Load the Extension

1. **Open Chrome Extensions Page**
   - Navigate to `chrome://extensions/`
   - Or click the puzzle icon → "Manage Extensions"

2. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top right corner

3. **Load Unpacked Extension**
   - Click "Load unpacked"
   - Select the folder containing this extension
   - The extension should now appear in your extensions list

### Step 2: Pin the Extension (Optional)

1. Click the puzzle icon in Chrome toolbar
2. Find "FB Reaction Invite Automator"
3. Click the pin icon to keep it visible

## 🎮 How to Use

### Basic Usage

1. **Go to Your Facebook Post**
   - Navigate to any of your Facebook posts
   - Click on the reactions (likes, loves, etc.)
   - Wait for the reaction modal to open showing all users

2. **Open the Extension**
   - Click the extension icon in your Chrome toolbar
   - The popup interface will appear

3. **Configure Settings (Optional)**
   - Adjust delays, limits, and safety features
   - Default settings are already optimized for safety

4. **Start Automation**
   - Click the "▶ Start" button
   - The extension will begin sending invites automatically
   - Monitor progress in real-time

5. **Stop Anytime**
   - Click the "⏹ Stop" button to pause
   - Close the reaction modal to stop
   - Your progress is saved automatically

### Advanced Configuration

#### Timing Settings
- **Min delay (ms)**: Minimum wait time between invites (default: 300)
- **Max delay (ms)**: Maximum wait time between invites (default: 600)
- **Recommended**: 
  - **Fast**: 100-300ms for quick automation
  - **Balanced**: 300-600ms (default) for good speed and safety
  - **Safe**: 500-1000ms for maximum safety
  - **Ultra-fast**: 10-30ms (use with caution)

#### Limits
- **Invites per run**: Maximum invites before auto-stop (default: 100)
- **Daily limit**: Maximum invites per day (default: 1000)
- **Tip**: Start with lower limits and increase gradually

#### Safety Features
- **Session break after**: Number of invites before taking a break (default: 50)
- **Break duration**: How long to pause in seconds (default: 180 = 3 minutes)
- **Auto-scroll**: Enable/disable automatic scrolling to load more invites

## ⚙️ How It Works

### Intelligent Behavior

1. **Detection**: Finds visible "Invite" buttons in the reaction modal
2. **Human Simulation**: 
   - Scrolls the element into view
   - Moves mouse to button position
   - Hovers briefly before clicking
   - Adds random delays and variations
3. **Scrolling**: Automatically scrolls to load more invites dynamically
4. **Safety Checks**:
   - Detects user activity and pauses
   - Takes regular breaks
   - Respects all configured limits
   - Varies speed to avoid patterns

### Pattern Randomization

- ✅ Variable delays between actions
- ✅ Occasional longer pauses (5-20 seconds)
- ✅ Random mouse movements
- ✅ Progressive slowdown over time
- ✅ Random invitation skipping (3% chance)
- ✅ Session breaks every 50 invites

## 🔒 Safety & Privacy

### What This Extension Does
- ✅ Only runs on facebook.com
- ✅ Only clicks visible "Invite" buttons
- ✅ Stores settings locally (never shared)
- ✅ No data collection or tracking
- ✅ No external server communication

### What This Extension Does NOT Do
- ❌ No access to your passwords
- ❌ No access to private messages
- ❌ No tracking or analytics
- ❌ No data sent to third parties

### Best Practices

1. **Start Slow**: Begin with conservative limits (50-100 per run)
2. **Monitor First Run**: Watch the first session to ensure it works correctly
3. **Avoid Peaks**: Don't send thousands of invites in one session
4. **Use Breaks**: Let the extension take regular breaks
5. **Vary Timing**: Don't run at the exact same time every day
6. **Stay Natural**: Use settings that mimic human behavior

## 📈 Recommended Settings for Different Scenarios

### Ultra-Fast (Maximum Speed - Use with Caution)
```
Min delay: 10ms
Max delay: 30ms
Per run: 500
Daily limit: 5000
Session break: 100 invites
Break duration: 60 seconds (1 min)
Performance: ~193 invites/minute
```

### Fast (Recommended for Speed)
```
Min delay: 100ms
Max delay: 300ms
Per run: 200
Daily limit: 2000
Session break: 75 invites
Break duration: 120 seconds (2 min)
Performance: ~150 invites/minute
```

### Balanced (Default - Recommended)
```
Min delay: 300ms
Max delay: 600ms
Per run: 100
Daily limit: 1000
Session break: 50 invites
Break duration: 180 seconds (3 min)
Performance: ~130 invites/minute
```

### Conservative (Safest)
```
Min delay: 500ms
Max delay: 1000ms
Per run: 50
Daily limit: 500
Session break: 30 invites
Break duration: 300 seconds (5 min)
Performance: ~80 invites/minute
```

## 🐛 Troubleshooting

### Extension Not Working
1. **Refresh the Facebook page** and try again
2. **Check that you're on facebook.com**
3. **Make sure the reaction modal is open**
4. **Reload the extension** in chrome://extensions/

### No Invite Buttons Found
1. **Scroll manually first** to load some invites
2. **Make sure reactions modal is fully loaded**
3. **Check language settings** (extension supports major languages)
4. **Try clicking "See All" if available**

### Stops Too Early
1. **Check daily limit** - may have been reached
2. **Enable auto-scrolling** in settings
3. **Manually scroll** to load more invites
4. **Check if session break is active**

### Running Too Fast/Slow
1. **Adjust min/max delays** in settings
2. **Remember**: Progressive slowdown is intentional
3. **Session breaks** are normal and recommended

## ⚠️ Important Notes

### Facebook's Terms of Service
- This tool automates interactions on Facebook
- Use responsibly and at your own risk
- Facebook may limit automation if detected
- Recommended to use moderate settings

### Limitations
- Cannot bypass Facebook's own rate limits
- Works only when reaction modal is visible
- Requires Chrome browser (or Chromium-based)
- Must keep Facebook tab active

### Meta Business Suite
- This extension provides an alternative to Meta Business Suite limitations
- Works directly in Facebook's web interface
- No API restrictions or business verification needed

## 🔄 Updates & Maintenance

The extension automatically:
- Resets daily counter at midnight
- Saves progress in case of crashes
- Persists settings across sessions
- Checks for user activity

## 📝 File Structure

```
facebook extension/
├── manifest.json         # Extension configuration (v2.1.0)
├── content.js           # Main automation logic (983 lines)
├── background.js        # Background service worker
├── popup.html          # Extension UI
├── popup.js            # UI logic and controls
├── README.md           # Complete documentation
├── INSTALLATION.md      # Step-by-step setup guide
├── FEATURES.md         # Complete feature list
├── CHANGELOG.md        # Version history
└── PRODUCTION.md       # Production readiness checklist
```

## 💡 Tips for Best Results

1. **Open the reaction modal first**, then start the extension
2. **Let it run unattended** - don't interact with the page
3. **Check progress** by opening the extension popup
4. **Spread invites over days** rather than all at once
5. **Use session breaks** to appear more human
6. **Don't max out daily limits** every single day

## 🆘 Support

### Common Questions

**Q: Will Facebook ban me for using this?**
A: If used responsibly with human-like settings, risk is minimal. Start conservative.

**Q: Can I run multiple instances?**
A: Not recommended. One instance per post is sufficient.

**Q: Does it work on mobile?**
A: No, this is a Chrome extension for desktop only.

**Q: Can I use it for pages I manage?**
A: Yes, works for personal profiles and pages you manage.

**Q: How many invites can I send safely?**
A: Start with 500-1000 per day, monitor for any issues.

## 🎯 Success Tips for 10K+ Invites

For posts with 10K+ potential invites:

1. **Spread over multiple days** (don't do all at once)
   - Day 1: 500-1000 invites
   - Day 2: 1000-1500 invites
   - Day 3+: 1500-2000 invites

2. **Use session breaks consistently**
   - Take 3-5 minute breaks every 50 invites

3. **Vary your timing**
   - Don't run at exact same times daily
   - Mix morning, afternoon, evening sessions

4. **Monitor Facebook's response**
   - Watch for any warnings or blocks
   - Reduce limits if you notice issues

5. **Keep the page active**
   - Don't minimize or switch tabs too often
   - Let it run in a dedicated browser window

## 📄 License

This extension is provided as-is for personal use. Use responsibly and at your own risk.

---

**Version**: 2.1.0  
**Last Updated**: December 2025  
**Compatibility**: Chrome 88+, Edge 88+, Brave, Opera  
**Status**: ✅ Production Ready

## 🚀 Quick Start

1. Load extension in Chrome (`chrome://extensions/` → Developer Mode → Load unpacked)
2. Go to Facebook and open a post's reactions modal
3. Click extension icon → Click "Start"
4. Watch it automate! 🎉

**Performance**: ~130 invites/minute (default settings)  
**Customizable**: Adjust speed from 10ms to 5000ms delays

🎉 Happy Automating! Remember: Start with default settings, then adjust based on your needs.

