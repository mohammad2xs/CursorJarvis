# CursorJarvis Chrome Extension

A powerful Chrome extension that integrates CursorJarvis AI with Comet (Perplexity's browser) to provide AI-powered strategic account management for Getty Images sales executives.

## Features

### 🧠 AI-Powered Sales Intelligence
- **Voice Recording & Analysis**: Record calls and get AI-powered analysis with sentiment, engagement, and coaching insights
- **Real-time Coaching**: Get live suggestions during calls for objection handling and closing strategies
- **Page Analysis**: Automatically analyze web pages for Getty Images account opportunities
- **Proactive Insights**: AI generates insights for revenue growth and customer satisfaction

### 📊 Getty Images Optimized
- **Account Detection**: Automatically detects Getty Images accounts from page content
- **Revenue Tracking**: Track all revenue attribution, even incidental purchases
- **Visual Content Strategy**: AI-powered recommendations for visual content solutions
- **Competitive Intelligence**: Monitor competitive threats and displacement opportunities

### 🎯 Strategic Account Management
- **Tier-based Account Management**: Organize accounts by priority (Tier 1, 2, 3)
- **Revenue Forecasting**: AI-powered revenue predictions and optimization strategies
- **Account Expansion**: Identify new department penetration opportunities
- **Customer Satisfaction**: Track and improve customer satisfaction scores

## Installation

### Development Installation

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd CursorJarvis/chrome-extension
   ```

2. **Load Extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `chrome-extension` folder
   - The extension should now appear in your extensions list

3. **Configure Backend**
   - Make sure your CursorJarvis backend is running on `http://localhost:3000`
   - Update the API endpoints in the extension files if needed

### Production Installation

1. **Build Extension**
   ```bash
   npm run build
   ```

2. **Package Extension**
   - Zip the `chrome-extension` folder contents
   - Upload to Chrome Web Store for distribution

## Usage

### Basic Usage

1. **Open Comet/Perplexity**: Navigate to any Comet or Perplexity page
2. **Activate Extension**: Click the CursorJarvis icon in the Chrome toolbar
3. **Open Sidebar**: Click "Open Dashboard" to access the full sidebar
4. **Analyze Page**: Use "Analyze Page" to get AI insights about the current page
5. **Record Calls**: Use "Record Call" to capture and analyze sales conversations

### Advanced Features

#### Account Detection
The extension automatically detects Getty Images accounts from page content:
- Boeing, Caterpillar, Chevron (Tier 1)
- ExxonMobil, Lockheed Martin, Parker Hannifin (Tier 2)
- Other strategic accounts (Tier 3)

#### Voice Recording
1. Click "Record Call" in the sidebar
2. Grant microphone permissions
3. Speak naturally during your call
4. Stop recording to get AI analysis
5. Review sentiment, engagement, and revenue opportunities

#### Page Analysis
1. Navigate to any relevant page
2. Click "Analyze Page" in the sidebar
3. Get AI insights about:
   - Revenue opportunities
   - Competitive threats
   - Account expansion possibilities
   - Visual content needs

## Configuration

### API Endpoints
Update the following files to point to your CursorJarvis backend:

- `popup.js`: Update API URLs
- `sidebar.js`: Update API URLs
- `content.js`: Update API URLs
- `background.js`: Update API URLs

### Account Configuration
Modify `background.js` to add or update Getty Images accounts:

```javascript
const gettyAccounts = [
  'Boeing', 'Caterpillar', 'Chevron', // Add your accounts here
  // ...
];
```

## File Structure

```
chrome-extension/
├── manifest.json          # Extension manifest
├── popup.html             # Extension popup UI
├── popup.css              # Popup styles
├── popup.js               # Popup functionality
├── sidebar.html           # Sidebar UI
├── sidebar.css            # Sidebar styles
├── sidebar.js             # Sidebar functionality
├── sidebar-inject.js      # Sidebar injection script
├── content.js             # Content script for page integration
├── content.css            # Content script styles
├── background.js          # Background service worker
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md              # This file
```

## API Integration

The extension integrates with the CursorJarvis backend through the following endpoints:

- `POST /api/enhanced-jarvis/analyze-page` - Analyze current page
- `POST /api/enhanced-jarvis/call-recording` - Process call recordings
- `POST /api/enhanced-jarvis/generate-insights` - Generate AI insights
- `GET /api/enhanced-jarvis/visual-content-strategy` - Get visual content strategy
- `POST /api/enhanced-jarvis/sync-data` - Sync extension data

## Permissions

The extension requires the following permissions:

- `activeTab`: Access current tab content
- `storage`: Store extension data locally
- `tabs`: Access tab information
- `scripting`: Inject content scripts
- `background`: Run background tasks
- `notifications`: Show notifications
- `host_permissions`: Access Comet/Perplexity and CursorJarvis domains

## Troubleshooting

### Common Issues

1. **Extension Not Loading**
   - Check that all files are in the correct location
   - Verify `manifest.json` is valid
   - Check Chrome's extension error console

2. **API Calls Failing**
   - Ensure CursorJarvis backend is running
   - Check API endpoint URLs
   - Verify CORS settings on backend

3. **Voice Recording Not Working**
   - Check microphone permissions
   - Ensure HTTPS connection (required for microphone access)
   - Verify audio format support

4. **Account Detection Not Working**
   - Check account names in `background.js`
   - Verify page content is accessible
   - Check console for JavaScript errors

### Debug Mode

Enable debug mode by adding this to the console:

```javascript
localStorage.setItem('cursorjarvis-debug', 'true');
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact:
- Email: support@cursorjarvis.com
- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)

## Changelog

### v1.0.0
- Initial release
- Basic sidebar integration
- Voice recording functionality
- Page analysis capabilities
- Getty Images account detection
- Revenue tracking integration
