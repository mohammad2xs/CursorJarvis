// CursorJarvis Chrome Extension Popup Script
class CursorJarvisPopup {
  constructor() {
    this.currentAccount = null;
    this.insights = [];
    this.stats = {
      totalRevenue: 0,
      activeCalls: 0,
      insightsCount: 0
    };
    
    this.init();
  }

  async init() {
    await this.loadData();
    this.setupEventListeners();
    this.updateUI();
  }

  async loadData() {
    try {
      // Load data from storage
      const result = await chrome.storage.local.get([
        'currentAccount',
        'insights',
        'stats'
      ]);

      this.currentAccount = result.currentAccount || null;
      this.insights = result.insights || [];
      this.stats = result.stats || this.stats;

      // If no current account, try to detect from active tab
      if (!this.currentAccount) {
        await this.detectCurrentAccount();
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  async detectCurrentAccount() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Check if we're on a Getty Images account page or similar
      if (tab.url && (tab.url.includes('perplexity.ai') || tab.url.includes('comet.perplexity.ai'))) {
        // Try to extract account information from the page
        const results = await chrome.tabs.executeScript(tab.id, {
          code: `
            // Look for Getty Images account indicators
            const accountIndicators = document.querySelectorAll('[data-account], .account-name, .company-name');
            if (accountIndicators.length > 0) {
              return {
                name: accountIndicators[0].textContent.trim(),
                detected: true
              };
            }
            return null;
          `
        });

        if (results && results[0]) {
          this.currentAccount = {
            name: results[0].name,
            tier: 2,
            revenue: 0,
            growth: 0
          };
        }
      }
    } catch (error) {
      console.error('Error detecting account:', error);
    }
  }

  setupEventListeners() {
    // Open sidebar
    document.getElementById('openSidebar').addEventListener('click', () => {
      this.openSidebar();
    });

    // Record call
    document.getElementById('recordCall').addEventListener('click', () => {
      this.startCallRecording();
    });

    // Analyze page
    document.getElementById('analyzePage').addEventListener('click', () => {
      this.analyzeCurrentPage();
    });

    // Open settings
    document.getElementById('openSettings').addEventListener('click', () => {
      this.openSettings();
    });

    // Account selection
    document.getElementById('currentAccountCard').addEventListener('click', () => {
      this.showAccountSelector();
    });
  }

  updateUI() {
    this.updateCurrentAccount();
    this.updateInsights();
    this.updateStats();
  }

  updateCurrentAccount() {
    const accountCard = document.getElementById('currentAccountCard');
    const accountName = accountCard.querySelector('.account-name');
    const accountTier = accountCard.querySelector('.account-tier');
    const revenueAmount = accountCard.querySelector('.revenue-amount');
    const revenueGrowth = accountCard.querySelector('.revenue-growth');

    if (this.currentAccount) {
      accountName.textContent = this.currentAccount.name;
      accountTier.textContent = `Tier ${this.currentAccount.tier}`;
      accountTier.className = `account-tier tier-${this.currentAccount.tier}`;
      revenueAmount.textContent = `$${this.currentAccount.revenue.toLocaleString()}`;
      revenueGrowth.textContent = `+${(this.currentAccount.growth * 100).toFixed(1)}%`;
    } else {
      accountName.textContent = 'Select an Account';
      accountTier.textContent = '-';
      revenueAmount.textContent = '$0';
      revenueGrowth.textContent = '+0%';
    }
  }

  updateInsights() {
    const insightsList = document.getElementById('insightsList');
    
    if (this.insights.length === 0) {
      insightsList.innerHTML = `
        <div class="insight-item">
          <div class="insight-icon">💡</div>
          <div class="insight-text">No insights yet. Start by selecting an account.</div>
        </div>
      `;
      return;
    }

    insightsList.innerHTML = this.insights.slice(0, 3).map(insight => `
      <div class="insight-item">
        <div class="insight-icon">${this.getInsightIcon(insight.type)}</div>
        <div class="insight-text">${insight.title}</div>
      </div>
    `).join('');
  }

  updateStats() {
    document.getElementById('totalRevenue').textContent = `$${this.stats.totalRevenue.toLocaleString()}`;
    document.getElementById('activeCalls').textContent = this.stats.activeCalls;
    document.getElementById('insightsCount').textContent = this.stats.insightsCount;
  }

  getInsightIcon(type) {
    const icons = {
      'revenue_opportunity': '💰',
      'risk_alert': '⚠️',
      'competitive_threat': '👁️',
      'expansion_opportunity': '📈',
      'customer_satisfaction': '😊'
    };
    return icons[type] || '💡';
  }

  async openSidebar() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Inject sidebar into the current tab
      await chrome.tabs.executeScript(tab.id, {
        file: 'sidebar-inject.js'
      });

      // Close popup
      window.close();
    } catch (error) {
      console.error('Error opening sidebar:', error);
      this.showNotification('Error opening sidebar', 'error');
    }
  }

  async startCallRecording() {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Start recording
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        this.processCallRecording(audioBlob);
      };
      
      mediaRecorder.start();
      
      // Update UI to show recording
      const recordBtn = document.getElementById('recordCall');
      recordBtn.innerHTML = '<span class="icon">⏹️</span> Stop Recording';
      recordBtn.classList.add('recording');
      
      // Stop recording after 5 minutes or when clicked again
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          stream.getTracks().forEach(track => track.stop());
        }
      }, 300000);
      
      recordBtn.onclick = () => {
        mediaRecorder.stop();
        stream.getTracks().forEach(track => track.stop());
        recordBtn.innerHTML = '<span class="icon">🎙️</span> Record Call';
        recordBtn.classList.remove('recording');
      };
      
    } catch (error) {
      console.error('Error starting call recording:', error);
      this.showNotification('Error starting recording', 'error');
    }
  }

  async processCallRecording(audioBlob) {
    try {
      // Convert audio to text (you would integrate with a speech-to-text service)
      const formData = new FormData();
      formData.append('audio', audioBlob);
      
      // Send to your CursorJarvis backend
      const response = await fetch('http://localhost:3000/api/enhanced-jarvis/call-recording', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();
        this.addInsight({
          type: 'call_analysis',
          title: 'Call Analysis Complete',
          description: `Sentiment: ${result.analysis.sentiment}, Engagement: ${result.analysis.engagement}`,
          timestamp: new Date()
        });
        this.showNotification('Call analysis complete!', 'success');
      }
    } catch (error) {
      console.error('Error processing call recording:', error);
      this.showNotification('Error processing recording', 'error');
    }
  }

  async analyzeCurrentPage() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Extract page content
      const results = await chrome.tabs.executeScript(tab.id, {
        code: `
          ({
            title: document.title,
            url: window.location.href,
            content: document.body.innerText.substring(0, 5000)
          })
        `
      });

      if (results && results[0]) {
        const pageData = results[0];
        
        // Send to CursorJarvis for analysis
        const response = await fetch('http://localhost:3000/api/enhanced-jarvis/analyze-page', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...pageData,
            accountId: this.currentAccount?.id
          })
        });

        if (response.ok) {
          const analysis = await response.json();
          this.addInsight({
            type: 'page_analysis',
            title: 'Page Analysis Complete',
            description: analysis.summary,
            timestamp: new Date()
          });
          this.showNotification('Page analysis complete!', 'success');
        }
      }
    } catch (error) {
      console.error('Error analyzing page:', error);
      this.showNotification('Error analyzing page', 'error');
    }
  }

  addInsight(insight) {
    this.insights.unshift(insight);
    this.insights = this.insights.slice(0, 10); // Keep only last 10 insights
    this.stats.insightsCount = this.insights.length;
    
    // Save to storage
    chrome.storage.local.set({
      insights: this.insights,
      stats: this.stats
    });
    
    this.updateUI();
  }

  async showAccountSelector() {
    // This would open a modal or new tab with account selection
    // For now, we'll use a simple prompt
    const accountName = prompt('Enter account name:');
    if (accountName) {
      this.currentAccount = {
        name: accountName,
        tier: 2,
        revenue: 0,
        growth: 0
      };
      
      await chrome.storage.local.set({ currentAccount: this.currentAccount });
      this.updateUI();
    }
  }

  openSettings() {
    // Open settings page
    chrome.tabs.create({
      url: chrome.runtime.getURL('settings.html')
    });
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to popup
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new CursorJarvisPopup();
});
