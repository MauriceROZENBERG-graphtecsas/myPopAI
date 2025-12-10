# myPopAI - Web Applications Launcher / NotebookLM source provider

A modern, FREE cross-platform Progressive Web Application (PWA) launcher with a sleek professional design.
No API dependance !
URL: [myPopAI](https://graphtec.fr/mypopai)

## Why MyPopAI? Stop running after your Documntes and Apps!

MyppAI is a mutltiplatform Universal Launcher for Web Doocuments and Apps.
Notebook web sources: All myPopAI Assets are easily exported to NoteBookLM as web sources for further processing.

Tightly coupled to our [Bizelia AI Prompt Studio](https://graphtec.fr/bizelia-en) advanced, multi LLM AI Prompt Generator.

## Benefits

Create and manage efficiently your shared Docs, YouTube videos and Apps.
Shere these Assets with your partners
Improve NotebookLM web sources possibilies.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

### 🚀 Core Functionality
- **Quick Launch**: Click any app card to instantly open applications in a new tab
- **App Management**: Add, edit, and delete applications and Documents.
- **Import/Export**: JSON-based configuration for easy backup and sharing
- **PWA Support**: Install as a standalone app on desktop and mobile devices

### 🎨 Modern Design
- Smooth animations and transitions
- Fully responsive design (mobile, tablet, desktop)
- Dark theme optimized for low-light environments

### 💾 Configuration
- Session-based storage (apps persist during browser session)
- Export configuration to JSON and Markdown files for backup and sharing
- Import configuration from JSON file
- Pre-loaded with Bizelia AI Prompt Generator Studio.

## Installation

### Option 1: Open Directly
Simply open [myPopAI](https://graphtec.fr/mypopai) in a modern web browser (Chrome, Firefox, Edge, Safari, Brave, DuckDuckPro...)

### Option 2: Install as PWA
1. Open the application in a supported browser
2. Click the "Install" button in the header or banner
3. Follow browser prompts to add to home screen/applications

## File Structure

```
myPopAI/
├── index.html          # Main HTML file
├── styles.css          # All styling and animations
├── app.js             # Application logic
├── sw.js              # Service Worker for PWA functionality
├── manifest.json      # PWA manifest
├── config.json        # Example configuration file
├── myPopAI logo       # Logo
└── README.md          # This file

## Usage

### Adding Applications
1. Click the **"Add App"** button in the header
2. Fill in the form:
   - **Application Name**: Display name for the app
   - **URL / Path**: Full URL or local path
   - **Icon**: Font Awesome class (e.g., `fas fa-envelope`) or emoji (e.g., 📧)
3. Click **"Save"**

### Editing Applications
1. Hover over an app card
2. Click the **edit icon** (pencil)
3. Update the information
4. Click **"Save"**

### Deleting Applications
1. Hover over an app card
2. Click the **delete icon** (trash)
3. Confirm deletion in the dialog

### Import/Export Configuration

**Export:**
1. Click **"Import/Export"** button
2. Click **"Download"** to save configuration as JSON file

**Import:**
1. Click **"Import/Export"** button
2. Paste JSON configuration into the text area
3. Click **"Import"**

### Icon Options

**Font Awesome Icons:**
- Envelope: `fas fa-envelope`
- GitHub: `fab fa-github`
- Code: `fas fa-code`
- Camera: `fas fa-camera`
- Music: `fas fa-music`

**Emojis:**
Simply use any emoji: 📧 🚀 💻 🎮 🎨 etc.

Browse more icons at:
- [Font Awesome Icons](https://fontawesome.com/icons)
- [Emojipedia](https://emojipedia.org/)

## Configuration File Format

The configuration is stored as a JSON array:

```json
[
  {
    "id": 1,
    "name": "Gmail",
    "url": "https://mail.google.com",
    "icon": "fas fa-envelope"
  },
  {
    "id": 2,
    "name": "ChatGPT",
    "url": "https://chat.openai.com",
    "icon": "🤖"
  }
]
```

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+
- ✅ Opera 76+

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Custom properties, animations, grid, flexbox
- **Vanilla JavaScript**: No framework dependencies
- **PWA**: Service Worker, Web Manifest
- **Font Awesome 6.4.0**: Icon library
- **Google Fonts**: Manrope, Space Mono

### PWA Features
- Offline support via Service Worker
- Installable on desktop and mobile
- Standalone display mode
- Custom splash screen
- Theme customization

### Storage Notes
- LocalStorage is attempted for persistence
- Falls back to session-only storage in restricted environments (e.g., iframes)
- Use Import/Export for cross-session persistence

## Customization

### Changing Colors
Edit CSS variables in `styles.css`:

```css
:root {
    --bg-primary: #0a0e27;        /* Main background */
    --bg-secondary: #151933;      /* Card backgrounds */
    --accent-primary: #00f5ff;    /* Cyan accent */
    --accent-secondary: #ff006e;  /* Magenta accent */
}
```

### Changing Fonts
Update font imports in `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=YOUR_FONT&display=swap" rel="stylesheet">
```

### Default Apps
Modify the `defaultApps` array in `app.js`:

```javascript
const defaultApps = [
    {
        id: 1,
        name: 'Your App',
        url: 'https://example.com',
        icon: 'fas fa-star'
    }
];
```

## Troubleshooting

**Apps don't persist after refresh:**
- LocalStorage may be disabled or restricted
- Use the Import/Export feature to save/restore configuration
- Check browser privacy settings

**PWA won't install:**
- Ensure using HTTPS (or localhost)
- Check that all PWA requirements are met
- Try a different browser

**Icons not showing:**
- Verify Font Awesome CDN is accessible
- Check icon class names are correct
- Use emojis as fallback

## License

MIT License - feel free to use, modify, and distribute

## Credits

- **Design**: Custom futuristic/cyberpunk aesthetic
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Manrope, Space Mono)

## Support

For issues or questions:
1. Check browser console for errors
2. Verify all files are in the same directory
3. Ensure using a modern browser
4. Check internet connection for CDN resources

---

**Made with ❤️ for productivity enthusiasts**
