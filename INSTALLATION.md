# 🚀 Quick Installation Guide

## Step-by-Step Installation

### 1. Open Chrome Extensions
- Type `chrome://extensions/` in your address bar and press Enter
- OR click the three dots (⋮) → More Tools → Extensions

### 2. Enable Developer Mode
- Look for the **"Developer mode"** toggle in the top right
- Click to turn it **ON** (it should be blue/enabled)

### 3. Load the Extension
- Click the **"Load unpacked"** button (appears after enabling Developer mode)
- Browse to and select the folder: `e:\facebook extensiom`
- Click "Select Folder"

### 4. Verify Installation
You should see the extension appear with:
- Name: "FB Reaction Invite Automator"
- Version: 2.0
- Status: Enabled

### 5. Pin to Toolbar (Optional but Recommended)
- Click the puzzle icon 🧩 in Chrome's toolbar
- Find "FB Reaction Invite Automator"
- Click the pin icon 📌 next to it

---

## 🎯 How to Use

### First Time Setup

1. **Go to Facebook**
   - Navigate to `https://www.facebook.com`
   - Go to one of your posts

2. **Open Reactions**
   - Click on the reactions count (e.g., "120 likes")
   - A modal/popup will appear showing who reacted
   - Wait for it to fully load

3. **Start the Extension**
   - Click the extension icon in your toolbar
   - Review the settings (defaults are safe)
   - Click **"▶ Start"** button

4. **Monitor Progress**
   - Watch the status change to "Running ⚡"
   - See real-time counts updating
   - The extension will automatically scroll and send invites

5. **Stop When Done**
   - Click **"⏹ Stop"** to pause anytime
   - Or let it complete automatically
   - Your progress is saved

---

## ⚙️ Recommended First-Time Settings

For your first run, use these **safe settings**:

```
Min delay: 1000 ms
Max delay: 2500 ms
Invites per run: 50
Daily limit: 500
Session break after: 30 invites
Break duration: 180 seconds
Auto-scroll: ✓ Enabled
```

After confirming it works well, you can gradually increase the limits.

---

## 🔧 Troubleshooting

### "Extension error" when loading
- **Make sure** you selected the correct folder
- The folder should contain: `manifest.json`, `content.js`, `popup.html`, etc.

### Extension icon doesn't appear
- Refresh the extensions page (`chrome://extensions/`)
- Make sure the extension is **Enabled** (toggle should be on)
- Try reloading the extension (click refresh icon)

### "Can't read property" error
- Click the **"Errors"** button on the extension
- Click **"Refresh"** icon on the extension card
- Reload the Facebook page

### Extension doesn't start
1. Make sure you're on **facebook.com**
2. Make sure the **reactions modal is open**
3. Try **refreshing the Facebook page**
4. Open extension popup and check status

### No invites being sent
1. **Scroll manually** in the reactions modal first
2. Look for buttons that say **"Invite"**
3. Check that buttons aren't already **"Invited"**
4. Enable **"Auto-scroll"** in settings

---

## 📱 Testing the Extension

### Quick Test Run

1. Find a post with several reactions
2. Open the reactions modal
3. Set these test settings:
   - Per run: 10
   - Min delay: 500ms
   - Max delay: 1000ms
4. Click Start
5. Watch it send 10 invites

If successful, increase the limits for actual use.

---

## 🎓 Understanding the Interface

### Status Indicators
- **Idle**: Ready to start
- **Running ⚡**: Actively sending invites
- **Break Time ☕**: Taking a session break
- **Stopped 🛑**: Manually stopped
- **Completed ✅**: Finished the run
- **Daily Limit 🚫**: Daily cap reached

### Counter Meanings
- **This run**: Current session count (resets on start)
- **Session**: Invites since last break
- **Today**: Total invites sent today (resets at midnight)

---

## ⚠️ Important First-Time Notes

1. **Test First**: Do a small test run (10-20 invites) to verify it works
2. **Stay Conservative**: Don't jump to maximum limits immediately
3. **Watch First Session**: Monitor the first full run to ensure proper behavior
4. **Don't Interfere**: While running, avoid clicking in the Facebook tab
5. **Keep Tab Active**: Don't minimize or switch tabs excessively

---

## 🎯 For Posts with 10,000+ Reactions

Since you mentioned having 10K+ reactions per post:

### Daily Schedule Recommendation

**Week 1** (Building Trust)
- Day 1: 500 invites
- Day 2: 750 invites
- Day 3: 1000 invites
- Day 4: Rest day (no invites)
- Day 5-7: 1000-1500 invites per day

**Week 2+** (Full Speed)
- Daily: 1500-2000 invites
- Take 1-2 rest days per week
- Vary timing (morning, afternoon, evening)

### Session Strategy
- Break into multiple sessions per day
- Example: 500 in morning + 500 in afternoon + 500 in evening
- Take 1-2 hour breaks between sessions
- Let the extension handle breaks within sessions

---

## 🆘 Getting Help

### Check Console for Errors
1. Open the Facebook page
2. Press `F12` to open Developer Tools
3. Click "Console" tab
4. Look for messages from the extension (marked with ✨, ✔️, ⚠️)

### Extension Logs
The extension logs its activity:
- ✔️ = Invite sent successfully
- ⚠️ = Warning or issue
- 🛑 = Stopped
- ☕ = Taking a break
- 📜 = Scrolling

---

## ✅ Installation Complete!

You're all set! The extension is now ready to help you automate your Facebook post reaction invites safely and efficiently.

**Remember**: Start small, monitor closely, and scale up gradually for best results.

---

**Need the full documentation?** See `README.md` for complete feature list and advanced settings.

