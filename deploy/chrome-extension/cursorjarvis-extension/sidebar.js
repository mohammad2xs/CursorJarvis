// CursorJarvis Sidebar Script
class CursorJarvisSidebar {
  constructor() {
    this.currentAccount = null;
    this.isRecording = false;
    this.mediaRecorder = null;
    this.audioChunks = [];
    
    this.init();
  }

  async init() {
    this.setupEventListeners();
    await this.loadAccountData();
    this.updateUI();
    this.analyzeCurrentPage();
  }

  setupEventListeners() {
    // Close sidebar
    document.getElementById('closeSidebar').addEventListener('click', () => {
      this.closeSidebar();
    });

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchTab(e.target.dataset.tab);
      });
    });

    // Quick actions
    document.getElementById('analyzePage').addEventListener('click', () => {
      this.analyzeCurrentPage();
    });

    document.getElementById('recordCall').addEventListener('click', () => {
      this.toggleCallRecording();
    });

    document.getElementById('generateInsights').addEventListener('click', () => {
      this.generateInsights();
    });

    document.getElementById('viewStrategy').addEventListener('click', () => {
      this.viewStrategy();
    });

    // Call recording
    document.getElementById('startRecording').addEventListener('click', () => {
      this.toggleCallRecording();
    });

    // Footer actions
    document.getElementById('openFullDashboard').addEventListener('click', () => {
      this.openFullDashboard();
    });

    document.getElementById('settings').addEventListener('click', () => {
      this.openSettings();
    });

    // Refresh insights
    document.getElementById('refreshInsights').addEventListener('click', () => {
      this.refreshInsights();
    });
  }

  async loadAccountData() {
    try {
      // Try to detect account from page content
      const accountInfo = await this.detectAccountFromPage();
      if (accountInfo) {
        this.currentAccount = accountInfo;
      } else {
        // Fallback to default account
        this.currentAccount = {
          name: 'Boeing',
          tier: 1,
          revenue: 150000,
          growth: 0.15
        };
      }
    } catch (error) {
      console.error('Error loading account data:', error);
    }
  }

  async detectAccountFromPage() {
    try {
      // Look for Getty Images account indicators in the page
      const accountIndicators = document.querySelectorAll(
        '[data-account], .account-name, .company-name, h1, h2, .title'
      );
      
      for (const indicator of accountIndicators) {
        const text = indicator.textContent.trim();
        if (this.isGettyAccount(text)) {
          return {
            name: text,
            tier: this.getAccountTier(text),
            revenue: this.getAccountRevenue(text),
            growth: this.getAccountGrowth(text)
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error detecting account:', error);
      return null;
    }
  }

  isGettyAccount(text) {
    const gettyAccounts = [
      'Boeing', 'Caterpillar', 'Chevron', 'ExxonMobil', 'Lockheed Martin',
      'Parker Hannifin', 'RTX Corporation', 'San Diego Gas & Electric',
      'Sempra', 'University of Maryland Medical System', 'IQVIA',
      'Infosys', 'Philips', 'Schneider Electric', 'Wahl Clipper'
    ];
    
    return gettyAccounts.some(account => 
      text.toLowerCase().includes(account.toLowerCase())
    );
  }

  getAccountTier(accountName) {
    const tier1Accounts = ['Boeing', 'Caterpillar', 'Chevron'];
    const tier2Accounts = ['ExxonMobil', 'Lockheed Martin', 'Parker Hannifin'];
    
    if (tier1Accounts.some(account => accountName.includes(account))) return 1;
    if (tier2Accounts.some(account => accountName.includes(account))) return 2;
    return 3;
  }

  getAccountRevenue(accountName) {
    // Mock revenue data - in real implementation, this would come from your backend
    const revenueMap = {
      'Boeing': 150000,
      'Caterpillar': 120000,
      'Chevron': 95000,
      'ExxonMobil': 75000,
      'Lockheed Martin': 65000
    };
    
    for (const [account, revenue] of Object.entries(revenueMap)) {
      if (accountName.includes(account)) return revenue;
    }
    
    return 50000; // Default revenue
  }

  getAccountGrowth(accountName) {
    // Mock growth data
    return Math.random() * 0.3 + 0.05; // 5-35% growth
  }

  updateUI() {
    this.updateAccountInfo();
    this.updateInsights();
    this.updateActivity();
  }

  updateAccountInfo() {
    if (this.currentAccount) {
      document.getElementById('accountName').textContent = this.currentAccount.name;
      document.getElementById('currentRevenue').textContent = `$${(this.currentAccount.revenue / 1000).toFixed(0)}K`;
      document.getElementById('growthRate').textContent = `+${(this.currentAccount.growth * 100).toFixed(0)}%`;
      
      const tierElement = document.querySelector('.account-tier');
      tierElement.textContent = `Tier ${this.currentAccount.tier}`;
      tierElement.className = `account-tier tier-${this.currentAccount.tier}`;
    }
  }

  updateInsights() {
    const insightsList = document.getElementById('insightsList');
    
    // Mock insights - in real implementation, these would come from your backend
    const insights = [
      {
        type: 'revenue_opportunity',
        title: 'Marketing Department Expansion',
        content: 'Marketing team shows interest in premium visual content solutions',
        priority: 'high'
      },
      {
        type: 'competitive_threat',
        title: 'Shutterstock Competitive Threat',
        content: 'Shutterstock is aggressively targeting this account',
        priority: 'medium'
      },
      {
        type: 'expansion_opportunity',
        title: 'ESG Content Package',
        content: 'ESG content needs align with Getty Images sustainability offerings',
        priority: 'high'
      }
    ];

    insightsList.innerHTML = insights.map(insight => `
      <div class="insight-card ${insight.priority}-priority">
        <div class="insight-header">
          <div class="insight-icon">${this.getInsightIcon(insight.type)}</div>
          <div class="insight-title">${insight.title}</div>
          <div class="insight-priority">${insight.priority}</div>
        </div>
        <div class="insight-content">${insight.content}</div>
        <div class="insight-actions">
          <button class="action-btn primary" onclick="this.takeAction('${insight.type}')">Take Action</button>
          <button class="action-btn secondary" onclick="this.dismissInsight('${insight.type}')">Dismiss</button>
        </div>
      </div>
    `).join('');
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

  updateActivity() {
    const activityList = document.getElementById('activityList');
    
    // Mock activity - in real implementation, this would come from your backend
    const activities = [
      {
        icon: '📞',
        title: 'Call with Marketing Director',
        time: '2 hours ago'
      },
      {
        icon: '💡',
        title: 'New revenue opportunity identified',
        time: '4 hours ago'
      },
      {
        icon: '📊',
        title: 'Account strategy updated',
        time: '1 day ago'
      }
    ];

    activityList.innerHTML = activities.map(activity => `
      <div class="activity-item">
        <div class="activity-icon">${activity.icon}</div>
        <div class="activity-content">
          <div class="activity-title">${activity.title}</div>
          <div class="activity-time">${activity.time}</div>
        </div>
      </div>
    `).join('');
  }

  switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
  }

  async analyzeCurrentPage() {
    try {
      const pageData = {
        title: document.title,
        url: window.location.href,
        content: document.body.innerText.substring(0, 5000),
        accountId: this.currentAccount?.name
      };

      // Send to CursorJarvis backend for analysis
      const response = await fetch('http://localhost:3000/api/enhanced-jarvis/analyze-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pageData)
      });

      if (response.ok) {
        const analysis = await response.json();
        this.showNotification('Page analysis complete!', 'success');
        this.addActivity('Page analysis completed', '🔍');
      }
    } catch (error) {
      console.error('Error analyzing page:', error);
      this.showNotification('Error analyzing page', 'error');
    }
  }

  async toggleCallRecording() {
    if (this.isRecording) {
      this.stopCallRecording();
    } else {
      await this.startCallRecording();
    }
  }

  async startCallRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      
      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };
      
      this.mediaRecorder.onstop = () => {
        this.processCallRecording();
      };
      
      this.mediaRecorder.start();
      this.isRecording = true;
      
      // Update UI
      const recordBtn = document.getElementById('startRecording');
      recordBtn.textContent = '⏹️ Stop Recording';
      recordBtn.style.background = '#dc2626';
      
      // Update status
      const statusDot = document.querySelector('.status-dot');
      statusDot.style.background = '#dc2626';
      statusDot.nextElementSibling.textContent = 'Recording...';
      
    } catch (error) {
      console.error('Error starting recording:', error);
      this.showNotification('Error starting recording', 'error');
    }
  }

  stopCallRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      this.isRecording = false;
      
      // Update UI
      const recordBtn = document.getElementById('startRecording');
      recordBtn.textContent = '🎙️ Record';
      recordBtn.style.background = '#dc2626';
      
      // Update status
      const statusDot = document.querySelector('.status-dot');
      statusDot.style.background = '#4ade80';
      statusDot.nextElementSibling.textContent = 'Processing...';
    }
  }

  async processCallRecording() {
    try {
      const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
      
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('accountId', this.currentAccount?.name);
      
      const response = await fetch('http://localhost:3000/api/enhanced-jarvis/call-recording', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();
        this.showNotification('Call analysis complete!', 'success');
        this.addActivity('Call recorded and analyzed', '📞');
        
        // Update call analysis metrics
        this.updateCallAnalysis(result.analysis);
      }
    } catch (error) {
      console.error('Error processing call recording:', error);
      this.showNotification('Error processing recording', 'error');
    }
  }

  updateCallAnalysis(analysis) {
    // Update call analysis metrics in the UI
    const metrics = document.querySelectorAll('.analysis-metrics .metric-value');
    if (metrics.length >= 3) {
      metrics[0].textContent = `${analysis.sentiment}/10`;
      metrics[1].textContent = analysis.engagement;
      metrics[2].textContent = `$${analysis.revenuePotential}K`;
    }
  }

  async generateInsights() {
    try {
      const response = await fetch('http://localhost:3000/api/enhanced-jarvis/generate-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          accountId: this.currentAccount?.name,
          pageData: {
            title: document.title,
            url: window.location.href,
            content: document.body.innerText.substring(0, 5000)
          }
        })
      });

      if (response.ok) {
        const insights = await response.json();
        this.showNotification('New insights generated!', 'success');
        this.addActivity('AI insights generated', '💡');
        this.updateInsights();
      }
    } catch (error) {
      console.error('Error generating insights:', error);
      this.showNotification('Error generating insights', 'error');
    }
  }

  async viewStrategy() {
    try {
      const response = await fetch(`http://localhost:3000/api/enhanced-jarvis/visual-content-strategy?accountId=${this.currentAccount?.name}`);
      
      if (response.ok) {
        const strategy = await response.json();
        this.showNotification('Strategy loaded!', 'success');
        this.addActivity('Visual content strategy viewed', '📊');
      }
    } catch (error) {
      console.error('Error loading strategy:', error);
      this.showNotification('Error loading strategy', 'error');
    }
  }

  async refreshInsights() {
    await this.generateInsights();
  }

  addActivity(title, icon) {
    const activityList = document.getElementById('activityList');
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.innerHTML = `
      <div class="activity-icon">${icon}</div>
      <div class="activity-content">
        <div class="activity-title">${title}</div>
        <div class="activity-time">Just now</div>
      </div>
    `;
    
    activityList.insertBefore(activityItem, activityList.firstChild);
    
    // Keep only last 5 activities
    while (activityList.children.length > 5) {
      activityList.removeChild(activityList.lastChild);
    }
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      padding: 12px 16px;
      border-radius: 6px;
      font-size: 14px;
      z-index: 10001;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  closeSidebar() {
    const sidebar = document.getElementById('cursorjarvis-sidebar');
    sidebar.style.transform = 'translateX(100%)';
    
    setTimeout(() => {
      sidebar.remove();
    }, 300);
  }

  openFullDashboard() {
    window.open('http://localhost:3000/enhanced-jarvis', '_blank');
  }

  openSettings() {
    window.open('http://localhost:3000/settings', '_blank');
  }
}

// Initialize sidebar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new CursorJarvisSidebar();
});
