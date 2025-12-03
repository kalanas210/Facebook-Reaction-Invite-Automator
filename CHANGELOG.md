# Changelog

All notable changes to FB Reaction Invite Automator will be documented in this file.

## [2.1.0] - 2025-12-XX

### 🚀 Performance Improvements
- **Speed Optimization**: Reduced default delays from 800-2200ms to 300-600ms
- **Faster Click Simulation**: Optimized mouse events and hover delays
- **Reduced Wait Times**: Faster initial loading and retry mechanisms
- **Performance**: ~3x faster than previous version (~130 invites/minute)

### ✨ New Features
- **Smart Modal Detection**: Multiple strategies to find reaction modals
- **Enhanced Button Detection**: Better handling of nested button structures
- **Improved Scrolling**: More efficient modal scrolling with better wait times
- **Loading Status**: Shows "Loading..." status during content fetch

### 🛡️ Safety Improvements
- **Progressive Waiting**: Adaptive waits for slow connections
- **Better Error Handling**: More robust error messages and recovery
- **Connection Handling**: Improved handling of slow network connections

### 🐛 Bug Fixes
- Fixed modal detection for different Facebook layouts
- Improved button text detection (handles nested elements)
- Fixed scrolling detection in various modal structures
- Better handling of already-invited users

## [2.0.0] - 2025-12-XX

### Initial Release
- Basic invite automation
- Human-like delays and behavior
- Session breaks and daily limits
- Auto-scrolling support
- Multi-language support

---

## Performance Benchmarks

### Version 2.1.0 (Current)
- **Speed**: ~130 invites/minute (300-600ms delays)
- **Customizable**: 10-30ms = ~193 invites/minute (ultra-fast)
- **Safe**: 300-600ms = ~130 invites/minute (recommended)
- **Conservative**: 800-2200ms = ~40 invites/minute

### Recommended Settings
- **Fast**: 100-300ms delays
- **Balanced**: 300-600ms delays (default)
- **Safe**: 500-1000ms delays

