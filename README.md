# Hints for Evernote

A powerful Tampermonkey userscript that enhances your Evernote experience with keyboard shortcuts, improved text formatting tools, and UI enhancements.

## 🚀 Features

### Keyboard Shortcuts
- **Ctrl+Q**: Apply red text color to selected text
- **Ctrl+Shift+Q**: Open text color picker
- **Ctrl+G**: Open overflow submenu for additional tools
- **Ctrl+Shift+W** (macOS) / **Ctrl+Shift+E** (Windows): Open text highlight picker
- **Ctrl+Alt+H**: Show help with all available shortcuts

### UI Enhancements
- Custom styling for better visual experience
- Smart positioning of formatting menus near cursor
- Automatic handling of overflow menus
- Cross-platform compatibility (Windows, macOS, Linux)

### Smart Features
- **Layout-independent shortcuts**: Works regardless of keyboard layout
- **Error handling**: Robust error handling with user notifications
- **Configurable settings**: Customizable colors and behaviors
- **Help system**: Built-in help accessible via keyboard shortcut

## 📦 Installation

1. **Install Tampermonkey**:
   - [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - [Safari](https://apps.apple.com/us/app/tampermonkey/id1482490089)
   - [Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

2. **Install the script**:
   - Click [here to install](https://github.com/voloshanenko/Hints-for-Evernote/raw/main/Evernote.user.js)
   - Or manually copy the script content from `Evernote.user.js` into a new Tampermonkey script

3. **Enable the script** in Tampermonkey dashboard

## 🎯 Usage

1. Navigate to [Evernote Web](https://www.evernote.com/client/)
2. Open any note for editing
3. Select text you want to format
4. Use the keyboard shortcuts listed above
5. Press **Ctrl+Alt+H** for help anytime

## ⚙️ Configuration

The script automatically detects your operating system and adjusts shortcuts accordingly. You can customize:

- Primary text color (default: red)
- Highlight color (default: green)
- Verbose logging (default: enabled)

## 🔧 Technical Details

### Compatibility
- **Browsers**: Chrome, Firefox, Safari, Edge (with Tampermonkey)
- **OS**: Windows, macOS, Linux, FreeBSD
- **Evernote**: Web version only (`https://www.evernote.com/client/*`)

### Dependencies
- jQuery 3.7.1 (automatically loaded)
- waitForKeyElements utility (included)

### Key Components
- **Smart element detection**: Automatically finds and interacts with Evernote's UI elements
- **Menu positioning**: Dynamically positions formatting menus near your cursor
- **Error recovery**: Graceful handling of UI changes and errors
- **Cross-platform support**: Different shortcuts for different operating systems

## 🐛 Troubleshooting

### Common Issues

**Shortcuts not working?**
- Ensure the script is enabled in Tampermonkey
- Check that you're on a supported Evernote page
- Try refreshing the page

**Menus appearing in wrong position?**
- Make sure you have text selected before using shortcuts
- Try using Ctrl+G to access overflow menu first

**Script not loading?**
- Check browser console for errors
- Verify Tampermonkey is enabled
- Ensure you're on `https://www.evernote.com/client/*`

### Debug Mode
Enable verbose logging in the script to see detailed debug information in the browser console.

## 🤝 Contributing

Contributions are welcome! Please feel free to:

1. Report bugs or suggest features via [GitHub Issues](https://github.com/voloshanenko/Hints-for-Evernote/issues)
2. Submit pull requests with improvements
3. Share feedback on your experience

## 📝 Changelog

### v0.22 (Latest)
- Enhanced error handling and user notifications
- Improved cross-platform keyboard shortcut detection
- Added built-in help system (Ctrl+Alt+H)
- Better OS detection
- Custom styling for notifications
- Configuration options for colors and settings

### v0.21
- Initial stable release
- Basic keyboard shortcuts
- Text color and highlight tools
- Overflow menu handling

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Igor Voloshanenko**
- GitHub: [@voloshanenko](https://github.com/voloshanenko)

---

⭐ If you find this script helpful, please consider giving it a star on GitHub!