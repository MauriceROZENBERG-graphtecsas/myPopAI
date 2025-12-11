# myPopAI - Web Applications Launcher / NotebookLM Source Provider

A modern, FREE cross-platform Progressive Web Application (PWA) lauhncher with a sleek professional design.

When a user needs to save an essential link—whether from a web page or a YouTube video —simplicity, speed and accessibility are essential.

> **myPopA**I provides an efficient solution to store **Application and YouTube URLs** using a  direct, two-step process: 
> 1. User simply copy the URL from their source application, 
> 2. User calls **myPopAI** app to store it immediately in a structured and user-friendly format for future retrieval.
> **No API dependency required!**

🔗 **[Launch myPopAI](https://graphtec.fr/mypopai)**

![myPopAI-logo](https://graphtec.fr/mypopai/myPopAI-logo-small.jpg)

![Version](https://img.shields.io/badge/version-1.0.4-blue)
![License](https://img.shields.io/badge/license-Apache2-green)

## Why MyPopAI?

### Documents and App Launcher

**Web Launcher** - MyPopAI is a multiplatform universal launcher for web documents and apps.

**NotebookLM** - All myPopAI assets are easily exported to NotebookLM as web sources for further processing.

### AI Prompt Generator Support

Tightly integrated with our [Bizelia AI Prompt Studio](https://graphtec.fr/bizelia-en) - an advanced, multi-LLM AI Prompt Generator.

## Benefits

- Efficiently manage your shared docs, YouTube videos, and apps
- Share these assets with your partners
- Enhance NotebookLM web sources

## Features

### 🚀 Core Functionality

- **Quick Launch**: Click [myPopAI](https://graphtec.fr/mypopai) to instantly open applications in a new tab
- **App Management**: Add and manage applications and documents
- **Import/Export**: JSON-based configuration for easy backup and sharing; Markdown export for NotebookLM web sources
- **PWA Support**: Install as a standalone app on desktop and mobile devices
- **Data Sharing**: Easy synchronization across devices
- **Express Paste**: Quickly initiate adding a new application by attempting to paste a URL from your clipboard directly into the 'Add Application' form, with smart prompts for manual input if automatic paste isn't available.

### 🎨 Modern Design

- Fully responsive design (mobile, tablet, desktop)
- Dark theme optimized for low-light environments

### 💾 Configuration

- Session-based storage (apps persist during browser session)
- Export configuration to JSON and Markdown files for backup and sharing
- Import configuration from JSON file
- Pre-loaded with [Bizelia AI Prompt Generator Studio](https://graphtec.fr/bizelia-en)

## Installation

### Option 1: Open Directly

Simply open [myPopAI](https://graphtec.fr/mypopai) in any modern web browser (Chrome, Firefox, Edge, Safari, Brave, DuckDuckGo, etc.)

### Option 2: Install as PWA

1. Open the application in a supported browser
2. Click the **Install** button in the header or banner
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
├── myPopAI-logo       # Logo
└── README.md          # This file
```

## Usage

### Adding Applications

1. Click the **"+"** button in the header
2. Fill in the form:
   - **Application Name**: Display name for the app
   - **URL / Path**: Full URL or local path
   - **Icon**: Font Awesome class (e.g., `fas fa-envelope`), emoji (e.g., 📧), image file, or pasted clipboard image
3. Click **Save**

### Using Express Paste

The "Express Paste" feature streamlines the process of adding a new application or document.

1.  Click the **"Express Paste"** button (`<i class="fas fa-paste"></i> Express Paste`) in the header.
2.  The "Add Application" form will appear.
3.  **Automatic Paste (Desktop/Supported Browsers)**: If your browser supports direct clipboard access, the URL field will be automatically pre-filled with the content from your clipboard.
4.  **Manual Paste (Mobile/Restricted Browsers)**: If automatic paste isn't supported or fails, a message will prompt you to manually paste the URL into the field.
5.  Complete the remaining fields (Application Name, Icon, Description) as needed. For YouTube links, the name and description might be automatically fetched.
6.  Click **Save**.

### Editing Applications

1. Hover over an app card
2. Click the **edit icon** (pencil)
3. Update the information
4. Click **Save**

### Deleting Applications

1. Hover over an app card
2. Click the **delete icon** (trash)
3. Confirm deletion in the dialog

### Import/Export Configuration

**Export:**
1. Click **Import/Export** button
2. Click **Export** to save configuration as a JSON file

**Import:**
1. Click **Import/Export** button
2. Click **Import File** to paste JSON configuration data or select a file
3. Close popup window

### Icon Options

**Font Awesome Icons:**
Select from the Font Awesome icon library

**Emojis:**
Simply use any emoji: 📧 🚀 💻 🎮 🎨 etc.

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

## Technical Details

### Technologies Used

- **No API** needed
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
- Ensure you're using HTTPS (or localhost)
- Verify that all PWA requirements are met
- Try a different browser

**Icons not showing:**
- Verify Font Awesome CDN is accessible
- Check that icon class names are correct
- Use emojis as a fallback

## License

Apache 2.0 License - feel free to use, modify, and distribute

## Credits

- **Design**: Custom aesthetic
- **Icons**: Font Awesome and selected images
- **Fonts**: Google Fonts (Manrope, Space Mono)

## Support

For issues or questions:
1. Check browser console for errors
2. Verify all files are in the same directory
3. Ensure you're using a modern browser
4. Check internet connection for CDN resources

## Contact

myPopAI is developed in France by GRAPHTEC SAS, established since 1991.

**Contact:** Maurice ROZENBERG

📧 **Email:** [graphtec.fr@gmail.com](mailto:graphtec.fr@gmail.com?Subject=Info_and_support_myPopAI)

---

**Made with ❤️ for productivity enthusiasts**
