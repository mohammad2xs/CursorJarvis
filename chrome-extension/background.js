// CursorJarvis Background Script
class CursorJarvisBackground {
  constructor() {
    this.init();
  }

  init() {
    this.setupMessageListener();
    this.setupAlarms();
    this.setupContextMenus();
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      switch (request.action) {
        case 'pageAnalyzed':
          this.handlePageAnalysis(request.data, sender.tab);
          break;
        case 'getAccountData':
          this.getAccountData(request.accountId).then(sendResponse);
          return true; // Keep message channel open for async response
        case 'updateAccountData':
          this.updateAccountData(request.accountId, request.data);
          break;
        case 'generateInsights':
          this.generateInsights(request.accountId).then(sendResponse);
          return true;
        case 'recordCall':
          this.handleCallRecording(request.data);
          break;
        default:
          sendResponse({ success: false, error: 'Unknown action' });
      }
    });
  }

  setupAlarms() {
    // Set up periodic tasks
    chrome.alarms.create('updateInsights', { periodInMinutes: 30 });
    chrome.alarms.create('syncData', { periodInMinutes: 60 });
    
    chrome.alarms.onAlarm.addListener((alarm) => {
      switch (alarm.name) {
        case 'updateInsights':
          this.updateInsights();
          break;
        case 'syncData':
          this.syncData();
          break;
      }
    });
  }

  setupContextMenus() {
    chrome.contextMenus.create({
      id: 'analyzePage',
      title: 'Analyze with CursorJarvis',
      contexts: ['page', 'selection']
    });

    chrome.contextMenus.create({
      id: 'recordCall',
      title: 'Record Call',
      contexts: ['page']
    });

    chrome.contextMenus.onClicked.addListener((info, tab) => {
      switch (info.menuItemId) {
        case 'analyzePage':
          this.analyzePage(tab);
          break;
        case 'recordCall':
          this.startCallRecording(tab);
          break;
      }
    });
  }

  async handlePageAnalysis(pageData, tab) {
    try {
      // Store page data
      await chrome.storage.local.set({
        [`pageData_${tab.id}`]: {
          ...pageData,
          timestamp: Date.now()
        }
      });

      // Analyze for Getty Images account indicators
      const accountInfo = this.detectAccountFromPageData(pageData);
      if (accountInfo) {
        await this.updateCurrentAccount(accountInfo);
        
        // Notify content script
        chrome.tabs.sendMessage(tab.id, {
          action: 'accountDetected',
          account: accountInfo
        });
      }

      // Generate insights if account is detected
      if (accountInfo) {
        await this.generateInsights(accountInfo.name);
      }

    } catch (error) {
      console.error('Error handling page analysis:', error);
    }
  }

  detectAccountFromPageData(pageData) {
    const gettyAccounts = [
      'Boeing', 'Caterpillar', 'Chevron', 'ExxonMobil', 'Lockheed Martin',
      'Parker Hannifin', 'RTX Corporation', 'San Diego Gas & Electric',
      'Sempra', 'University of Maryland Medical System', 'IQVIA',
      'Infosys', 'Philips', 'Schneider Electric', 'Wahl Clipper'
    ];

    const content = (pageData.title + ' ' + pageData.content).toLowerCase();
    
    for (const account of gettyAccounts) {
      if (content.includes(account.toLowerCase())) {
        return {
          name: account,
          tier: this.getAccountTier(account),
          revenue: this.getAccountRevenue(account),
          growth: this.getAccountGrowth(account),
          detectedAt: new Date().toISOString()
        };
      }
    }

    return null;
  }

  getAccountTier(accountName) {
    const tier1Accounts = ['Boeing', 'Caterpillar', 'Chevron'];
    const tier2Accounts = ['ExxonMobil', 'Lockheed Martin', 'Parker Hannifin'];
    
    if (tier1Accounts.includes(accountName)) return 1;
    if (tier2Accounts.includes(accountName)) return 2;
    return 3;
  }

  getAccountRevenue(accountName) {
    const revenueMap = {
      'Boeing': 150000,
      'Caterpillar': 120000,
      'Chevron': 95000,
      'ExxonMobil': 75000,
      'Lockheed Martin': 65000
    };
    
    return revenueMap[accountName] || 50000;
  }

  getAccountGrowth(accountName) {
    return Math.random() * 0.3 + 0.05; // 5-35% growth
  }

  async updateCurrentAccount(accountInfo) {
    await chrome.storage.local.set({
      currentAccount: accountInfo
    });
  }

  async getAccountData(accountId) {
    try {
      const result = await chrome.storage.local.get(['currentAccount', 'insights', 'stats']);
      return {
        account: result.currentAccount,
        insights: result.insights || [],
        stats: result.stats || { totalRevenue: 0, activeCalls: 0, insightsCount: 0 }
      };
    } catch (error) {
      console.error('Error getting account data:', error);
      return null;
    }
  }

  async updateAccountData(accountId, data) {
    try {
      await chrome.storage.local.set({
        [`account_${accountId}`]: data
      });
    } catch (error) {
      console.error('Error updating account data:', error);
    }
  }

  async generateInsights(accountId) {
    try {
      // This would call your CursorJarvis backend
      const response = await fetch('http://localhost:3000/api/enhanced-jarvis/generate-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ accountId })
      });

      if (response.ok) {
        const insights = await response.json();
        await chrome.storage.local.set({
          insights: insights,
          lastInsightUpdate: Date.now()
        });
        return insights;
      }
    } catch (error) {
      console.error('Error generating insights:', error);
      return [];
    }
  }

  async updateInsights() {
    try {
      const result = await chrome.storage.local.get(['currentAccount']);
      if (result.currentAccount) {
        await this.generateInsights(result.currentAccount.name);
      }
    } catch (error) {
      console.error('Error updating insights:', error);
    }
  }

  async syncData() {
    try {
      // Sync data with CursorJarvis backend
      const result = await chrome.storage.local.get(['currentAccount', 'insights', 'stats']);
      
      if (result.currentAccount) {
        const response = await fetch('http://localhost:3000/api/enhanced-jarvis/sync-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(result)
        });

        if (response.ok) {
          const updatedData = await response.json();
          await chrome.storage.local.set(updatedData);
        }
      }
    } catch (error) {
      console.error('Error syncing data:', error);
    }
  }

  async analyzePage(tab) {
    try {
      await chrome.tabs.sendMessage(tab.id, {
        action: 'analyzePage'
      });
    } catch (error) {
      console.error('Error analyzing page:', error);
    }
  }

  async startCallRecording(tab) {
    try {
      await chrome.tabs.sendMessage(tab.id, {
        action: 'startCallRecording'
      });
    } catch (error) {
      console.error('Error starting call recording:', error);
    }
  }

  handleCallRecording(data) {
    // Handle call recording data
    console.log('Call recording data received:', data);
  }
}

// Initialize background script
new CursorJarvisBackground();
