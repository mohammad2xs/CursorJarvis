# CursorJarvis Chrome Extension - Usage Guide

## 🎯 Overview

The CursorJarvis Chrome Extension transforms your Comet (Perplexity) browser into a powerful AI-powered sales intelligence platform specifically designed for Getty Images Strategic Key Account Executives.

## 🚀 Quick Start

### 1. Installation
```bash
# Navigate to the chrome-extension directory
cd chrome-extension

# Run the deployment script
./deploy.sh

# Or manually load in Chrome:
# 1. Open Chrome → chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select the chrome-extension folder
```

### 2. First Use
1. **Open Comet/Perplexity**: Navigate to any Comet or Perplexity page
2. **Activate Extension**: Click the 🧠 icon in your Chrome toolbar
3. **Open Sidebar**: Click "Open Dashboard" to access the full interface
4. **Start Analyzing**: Use "Analyze Page" to get AI insights

## 🧠 Core Features

### Voice Recording & AI Analysis
- **Record Calls**: Click "Record Call" to capture sales conversations
- **AI Analysis**: Get sentiment, engagement, and revenue opportunity analysis
- **Real-time Coaching**: Receive live suggestions during calls
- **Post-call Insights**: Review detailed analysis and next steps

### Page Analysis
- **Automatic Detection**: AI automatically detects Getty Images accounts
- **Content Analysis**: Analyzes page content for revenue opportunities
- **Competitive Intelligence**: Identifies competitive threats and opportunities
- **Visual Content Strategy**: Recommends Getty Images solutions

### Account Management
- **Tier-based Organization**: Automatically categorizes accounts (Tier 1, 2, 3)
- **Revenue Tracking**: Tracks all revenue attribution, even incidental purchases
- **Growth Opportunities**: Identifies account expansion possibilities
- **Customer Satisfaction**: Monitors and improves customer satisfaction

## 📊 Dashboard Tabs

### Dashboard Tab
- **Account Overview**: Current account details and metrics
- **Quick Actions**: One-click access to key features
- **Recent Activity**: Timeline of your sales activities
- **Performance Metrics**: Revenue, growth, and satisfaction scores

### Insights Tab
- **AI Insights**: Proactive recommendations from AI
- **Revenue Opportunities**: Identified growth opportunities
- **Risk Alerts**: Potential account risks
- **Competitive Intelligence**: Market and competitor insights

### Calls Tab
- **Call Recording**: Start/stop call recording
- **Real-time Analysis**: Live call analysis and coaching
- **Call History**: Previous call recordings and analysis
- **Performance Metrics**: Call performance statistics

### Revenue Tab
- **Revenue Overview**: Current and projected revenue
- **Growth Opportunities**: Identified revenue growth opportunities
- **Optimization Strategies**: AI-recommended revenue optimization
- **Forecasting**: Revenue predictions and trends

## 🎯 Getty Images Specific Features

### Account Detection
The extension automatically detects these Getty Images accounts:

**Tier 1 (Highest Priority)**
- Boeing
- Caterpillar
- Chevron

**Tier 2 (High Priority)**
- ExxonMobil
- Lockheed Martin
- Parker Hannifin

**Tier 3 (Growth Priority)**
- RTX Corporation
- San Diego Gas & Electric
- Sempra
- University of Maryland Medical System
- IQVIA
- Infosys
- Philips
- Schneider Electric
- Wahl Clipper

### Visual Content Strategy
- **Content Recommendations**: AI suggests specific Getty Images solutions
- **Brand Alignment**: Ensures solutions align with client brand values
- **Competitive Displacement**: Identifies opportunities to replace competitors
- **Account Expansion**: Suggests new departments and use cases

## 🔧 Configuration

### API Endpoints
Update these files to point to your CursorJarvis backend:
- `popup.js`
- `sidebar.js`
- `content.js`
- `background.js`

Default endpoints:
```javascript
const API_BASE = 'http://localhost:3000/api/enhanced-jarvis';
```

### Account Customization
Add or modify Getty Images accounts in `background.js`:

```javascript
const gettyAccounts = [
  'Boeing', 'Caterpillar', 'Chevron',
  // Add your accounts here
];
```

## 🎙️ Voice Recording Workflow

### 1. Start Recording
- Click "Record Call" in the sidebar
- Grant microphone permissions
- Recording starts automatically

### 2. During Call
- Speak naturally
- AI provides real-time coaching suggestions
- Monitor sentiment and engagement levels

### 3. Stop Recording
- Click "Stop Recording" when done
- AI processes the recording
- Review analysis and insights

### 4. Review Analysis
- Sentiment analysis (1-10 scale)
- Engagement level (High/Medium/Low)
- Revenue opportunities identified
- Next steps recommended

## 📈 Revenue Intelligence

### Revenue Tracking
- **Direct Sales**: Revenue from direct sales activities
- **Incidental Purchases**: Revenue from website purchases
- **Renewals**: Revenue from contract renewals
- **Expansion**: Revenue from account expansion

### Revenue Optimization
- **Growth Opportunities**: AI-identified revenue growth potential
- **Account Expansion**: New department penetration strategies
- **Competitive Displacement**: Replacing competitor solutions
- **Visual Content Strategy**: Getty Images-specific recommendations

## 🔍 Page Analysis Workflow

### 1. Navigate to Relevant Page
- Any Comet/Perplexity page
- Getty Images account websites
- Industry news and articles
- Competitor websites

### 2. Analyze Page
- Click "Analyze Page" in sidebar
- AI processes page content
- Extracts relevant information

### 3. Review Insights
- Revenue opportunities
- Competitive threats
- Account expansion possibilities
- Visual content needs

## 🚨 Troubleshooting

### Common Issues

**Extension Not Loading**
- Check Chrome extensions page for errors
- Verify all files are in correct location
- Check `manifest.json` syntax

**API Calls Failing**
- Ensure CursorJarvis backend is running
- Check API endpoint URLs
- Verify CORS settings

**Voice Recording Not Working**
- Check microphone permissions
- Ensure HTTPS connection
- Verify audio format support

**Account Detection Not Working**
- Check account names in configuration
- Verify page content accessibility
- Check browser console for errors

### Debug Mode
Enable debug mode:
```javascript
localStorage.setItem('cursorjarvis-debug', 'true');
```

## 📱 Mobile Compatibility

The extension is optimized for desktop Chrome. Mobile support is limited due to Chrome extension restrictions on mobile devices.

## 🔒 Privacy & Security

- **Local Storage**: Extension data stored locally in Chrome
- **API Communication**: Secure HTTPS communication with backend
- **Voice Data**: Processed locally and sent to backend for analysis
- **No Data Collection**: No personal data collected by extension

## 🆘 Support

### Getting Help
- **GitHub Issues**: Create an issue for bugs or feature requests
- **Email Support**: support@cursorjarvis.com
- **Documentation**: Check README.md for technical details

### Reporting Issues
When reporting issues, include:
- Chrome version
- Extension version
- Steps to reproduce
- Console error messages
- Screenshots if applicable

## 🎉 Success Tips

### Maximize Effectiveness
1. **Use Voice Recording**: Record all important calls for AI analysis
2. **Analyze Pages**: Use page analysis on relevant websites
3. **Review Insights**: Regularly check AI-generated insights
4. **Track Revenue**: Monitor revenue attribution and growth
5. **Follow Recommendations**: Act on AI-suggested next steps

### Best Practices
- **Regular Use**: Use the extension consistently for best results
- **Account Focus**: Focus on Tier 1 and Tier 2 accounts
- **Call Analysis**: Review call analysis to improve performance
- **Revenue Tracking**: Track all revenue sources, including incidental purchases
- **Competitive Intelligence**: Monitor competitive threats and opportunities

## 🔄 Updates

### Automatic Updates
The extension will automatically update when new versions are available.

### Manual Updates
To manually update:
1. Download latest version
2. Remove old extension
3. Load new version
4. Data will be preserved

---

**Happy Selling with CursorJarvis! 🚀**
