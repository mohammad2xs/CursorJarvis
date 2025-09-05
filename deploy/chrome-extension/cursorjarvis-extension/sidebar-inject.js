// Sidebar Injection Script
(function() {
  'use strict';

  // Check if sidebar already exists
  if (document.getElementById('cursorjarvis-sidebar')) {
    return;
  }

  // Create sidebar container
  const sidebar = document.createElement('div');
  sidebar.id = 'cursorjarvis-sidebar';
  sidebar.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    width: 400px;
    height: 100vh;
    background: white;
    border-left: 1px solid #e2e8f0;
    box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    display: flex;
    flex-direction: column;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;

  // Create header
  const header = document.createElement('div');
  header.className = 'sidebar-header';
  header.style.cssText = `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
  `;

  header.innerHTML = `
    <div class="logo" style="display: flex; align-items: center; gap: 12px;">
      <div class="logo-icon" style="font-size: 24px; background: rgba(255, 255, 255, 0.2); width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">🧠</div>
      <div class="logo-text">
        <h2 style="font-size: 18px; font-weight: 700; margin: 0;">CursorJarvis</h2>
        <p style="font-size: 12px; opacity: 0.9; margin: 0;">Getty Images Sales AI</p>
      </div>
    </div>
    <button class="close-btn" id="closeSidebar" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer; padding: 4px; border-radius: 4px;">×</button>
  `;

  // Create tabs
  const tabs = document.createElement('div');
  tabs.className = 'sidebar-tabs';
  tabs.style.cssText = `
    display: flex;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    flex-shrink: 0;
  `;

  tabs.innerHTML = `
    <button class="tab-btn active" data-tab="dashboard" style="flex: 1; padding: 12px 16px; border: none; background: none; color: #667eea; font-size: 14px; font-weight: 500; cursor: pointer; border-bottom: 2px solid #667eea;">Dashboard</button>
    <button class="tab-btn" data-tab="insights" style="flex: 1; padding: 12px 16px; border: none; background: white; color: #64748b; font-size: 14px; font-weight: 500; cursor: pointer;">Insights</button>
    <button class="tab-btn" data-tab="calls" style="flex: 1; padding: 12px 16px; border: none; background: white; color: #64748b; font-size: 14px; font-weight: 500; cursor: pointer;">Calls</button>
    <button class="tab-btn" data-tab="revenue" style="flex: 1; padding: 12px 16px; border: none; background: white; color: #64748b; font-size: 14px; font-weight: 500; cursor: pointer;">Revenue</button>
  `;

  // Create content
  const content = document.createElement('div');
  content.className = 'sidebar-content';
  content.style.cssText = `
    flex: 1;
    overflow-y: auto;
    padding: 20px;
  `;

  content.innerHTML = `
    <!-- Dashboard Tab -->
    <div class="tab-content active" id="dashboard-tab">
      <div class="account-overview">
        <h3 style="font-size: 16px; font-weight: 600; color: #1e293b; margin-bottom: 16px;">Account Overview</h3>
        <div class="account-card" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <div class="account-info" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div class="account-name" id="accountName" style="font-size: 18px; font-weight: 700; color: #1e293b;">Boeing</div>
            <div class="account-tier tier-1" style="font-size: 12px; padding: 4px 8px; border-radius: 4px; background: #fef2f2; color: #dc2626; font-weight: 600;">Tier 1</div>
          </div>
          <div class="account-metrics" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="metric" style="text-align: center;">
              <div class="metric-value" id="currentRevenue" style="font-size: 20px; font-weight: 700; color: #059669; margin-bottom: 4px;">$150K</div>
              <div class="metric-label" style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Revenue</div>
            </div>
            <div class="metric" style="text-align: center;">
              <div class="metric-value" id="growthRate" style="font-size: 20px; font-weight: 700; color: #059669; margin-bottom: 4px;">+15%</div>
              <div class="metric-label" style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Growth</div>
            </div>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h3 style="font-size: 16px; font-weight: 600; color: #1e293b; margin-bottom: 16px;">Quick Actions</h3>
        <div class="action-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px;">
          <button class="action-card" id="analyzePage" style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; text-align: center; cursor: pointer;">
            <div class="action-icon" style="font-size: 24px; margin-bottom: 8px;">🔍</div>
            <div class="action-text" style="font-size: 12px; font-weight: 500; color: #475569;">Analyze Page</div>
          </button>
          <button class="action-card" id="recordCall" style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; text-align: center; cursor: pointer;">
            <div class="action-icon" style="font-size: 24px; margin-bottom: 8px;">🎙️</div>
            <div class="action-text" style="font-size: 12px; font-weight: 500; color: #475569;">Record Call</div>
          </button>
          <button class="action-card" id="generateInsights" style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; text-align: center; cursor: pointer;">
            <div class="action-icon" style="font-size: 24px; margin-bottom: 8px;">💡</div>
            <div class="action-text" style="font-size: 12px; font-weight: 500; color: #475569;">Generate Insights</div>
          </button>
          <button class="action-card" id="viewStrategy" style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; text-align: center; cursor: pointer;">
            <div class="action-icon" style="font-size: 24px; margin-bottom: 8px;">📊</div>
            <div class="action-text" style="font-size: 12px; font-weight: 500; color: #475569;">View Strategy</div>
          </button>
        </div>
      </div>

      <div class="recent-activity">
        <h3 style="font-size: 16px; font-weight: 600; color: #1e293b; margin-bottom: 16px;">Recent Activity</h3>
        <div class="activity-list" id="activityList">
          <div class="activity-item" style="display: flex; align-items: flex-start; gap: 12px; padding: 12px; background: #f8fafc; border-radius: 8px; margin-bottom: 12px;">
            <div class="activity-icon" style="font-size: 16px; margin-top: 2px;">📞</div>
            <div class="activity-content">
              <div class="activity-title" style="font-size: 14px; font-weight: 500; color: #1e293b; margin-bottom: 4px;">Call with Marketing Director</div>
              <div class="activity-time" style="font-size: 12px; color: #64748b;">2 hours ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Other tabs would be added here -->
    <div class="tab-content" id="insights-tab" style="display: none;">
      <h3>AI Insights</h3>
      <p>Insights will be displayed here...</p>
    </div>

    <div class="tab-content" id="calls-tab" style="display: none;">
      <h3>Call Intelligence</h3>
      <p>Call analysis will be displayed here...</p>
    </div>

    <div class="tab-content" id="revenue-tab" style="display: none;">
      <h3>Revenue Intelligence</h3>
      <p>Revenue data will be displayed here...</p>
    </div>
  `;

  // Create footer
  const footer = document.createElement('div');
  footer.className = 'sidebar-footer';
  footer.style.cssText = `
    padding: 16px 20px;
    background: #f8fafc;
    border-top: 1px solid #e2e8f0;
    flex-shrink: 0;
  `;

  footer.innerHTML = `
    <div class="footer-actions" style="display: flex; gap: 8px;">
      <button class="footer-btn" id="openFullDashboard" style="flex: 1; padding: 8px 12px; border: 1px solid #e2e8f0; background: white; color: #64748b; font-size: 12px; font-weight: 500; border-radius: 6px; cursor: pointer;">Open Full Dashboard</button>
      <button class="footer-btn" id="settings" style="flex: 1; padding: 8px 12px; border: 1px solid #e2e8f0; background: white; color: #64748b; font-size: 12px; font-weight: 500; border-radius: 6px; cursor: pointer;">Settings</button>
    </div>
  `;

  // Assemble sidebar
  sidebar.appendChild(header);
  sidebar.appendChild(tabs);
  sidebar.appendChild(content);
  sidebar.appendChild(footer);

  // Add to page
  document.body.appendChild(sidebar);

  // Animate in
  setTimeout(() => {
    sidebar.style.transform = 'translateX(0)';
  }, 10);

  // Add event listeners
  setupEventListeners();

  function setupEventListeners() {
    // Close sidebar
    document.getElementById('closeSidebar').addEventListener('click', () => {
      sidebar.style.transform = 'translateX(100%)';
      setTimeout(() => {
        sidebar.remove();
      }, 300);
    });

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(b => {
          b.style.background = 'white';
          b.style.color = '#64748b';
          b.style.borderBottom = '2px solid transparent';
        });
        e.target.style.background = '#f8fafc';
        e.target.style.color = '#667eea';
        e.target.style.borderBottom = '2px solid #667eea';

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
          content.style.display = 'none';
        });
        document.getElementById(`${e.target.dataset.tab}-tab`).style.display = 'block';
      });
    });

    // Quick actions
    document.getElementById('analyzePage').addEventListener('click', () => {
      analyzeCurrentPage();
    });

    document.getElementById('recordCall').addEventListener('click', () => {
      startCallRecording();
    });

    document.getElementById('generateInsights').addEventListener('click', () => {
      generateInsights();
    });

    document.getElementById('viewStrategy').addEventListener('click', () => {
      viewStrategy();
    });

    // Footer actions
    document.getElementById('openFullDashboard').addEventListener('click', () => {
      window.open('http://localhost:3000/enhanced-jarvis', '_blank');
    });

    document.getElementById('settings').addEventListener('click', () => {
      window.open('http://localhost:3000/settings', '_blank');
    });
  }

  function analyzeCurrentPage() {
    const pageData = {
      title: document.title,
      url: window.location.href,
      content: document.body.innerText.substring(0, 5000)
    };

    // Send to CursorJarvis backend
    fetch('http://localhost:3000/api/enhanced-jarvis/analyze-page', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pageData)
    })
    .then(response => response.json())
    .then(data => {
      showNotification('Page analysis complete!', 'success');
    })
    .catch(error => {
      console.error('Error analyzing page:', error);
      showNotification('Error analyzing page', 'error');
    });
  }

  function startCallRecording() {
    showNotification('Call recording started!', 'info');
  }

  function generateInsights() {
    showNotification('Generating insights...', 'info');
  }

  function viewStrategy() {
    showNotification('Loading strategy...', 'info');
  }

  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
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
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
})();
