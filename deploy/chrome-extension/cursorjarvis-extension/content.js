// CursorJarvis Content Script for Comet/Perplexity Integration
class CursorJarvisContentScript {
  constructor() {
    this.sidebar = null;
    this.isSidebarVisible = false;
    this.init();
  }

  init() {
    this.createSidebarButton();
    this.setupMessageListener();
    this.observePageChanges();
  }

  createSidebarButton() {
    // Create floating action button
    const fab = document.createElement('div');
    fab.id = 'cursorjarvis-fab';
    fab.innerHTML = '🧠';
    fab.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      cursor: pointer;
      z-index: 9999;
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
      transition: all 0.3s ease;
      user-select: none;
    `;

    fab.addEventListener('mouseenter', () => {
      fab.style.transform = 'scale(1.1)';
      fab.style.boxShadow = '0 6px 25px rgba(102, 126, 234, 0.6)';
    });

    fab.addEventListener('mouseleave', () => {
      fab.style.transform = 'scale(1)';
      fab.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.4)';
    });

    fab.addEventListener('click', () => {
      this.toggleSidebar();
    });

    document.body.appendChild(fab);
  }

  async toggleSidebar() {
    if (this.isSidebarVisible) {
      this.hideSidebar();
    } else {
      await this.showSidebar();
    }
  }

  async showSidebar() {
    if (this.sidebar) {
      this.sidebar.style.display = 'flex';
      this.isSidebarVisible = true;
      return;
    }

    try {
      // Create iframe for the sidebar
      const iframe = document.createElement('iframe');
      iframe.id = 'cursorjarvis-sidebar-iframe';
      iframe.src = chrome.runtime.getURL('sidebar.html');
      iframe.style.cssText = `
        position: fixed;
        top: 0;
        right: 0;
        width: 400px;
        height: 100vh;
        border: none;
        z-index: 10000;
        background: white;
        box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
        transform: translateX(100%);
        transition: transform 0.3s ease;
      `;

      document.body.appendChild(iframe);

      // Animate in
      setTimeout(() => {
        iframe.style.transform = 'translateX(0)';
      }, 10);

      this.sidebar = iframe;
      this.isSidebarVisible = true;

      // Update FAB
      const fab = document.getElementById('cursorjarvis-fab');
      fab.innerHTML = '✕';
      fab.style.background = '#dc2626';

    } catch (error) {
      console.error('Error showing sidebar:', error);
    }
  }

  hideSidebar() {
    if (this.sidebar) {
      this.sidebar.style.transform = 'translateX(100%)';
      
      setTimeout(() => {
        this.sidebar.style.display = 'none';
      }, 300);
    }

    this.isSidebarVisible = false;

    // Update FAB
    const fab = document.getElementById('cursorjarvis-fab');
    fab.innerHTML = '🧠';
    fab.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      switch (request.action) {
        case 'toggleSidebar':
          this.toggleSidebar();
          sendResponse({ success: true });
          break;
        case 'analyzePage':
          this.analyzePage();
          sendResponse({ success: true });
          break;
        case 'getPageData':
          sendResponse(this.getPageData());
          break;
        default:
          sendResponse({ success: false, error: 'Unknown action' });
      }
    });
  }

  observePageChanges() {
    // Watch for page changes in SPA
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Page content changed, re-analyze
          setTimeout(() => {
            this.analyzePageContent();
          }, 1000);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  analyzePageContent() {
    // Extract key information from the page
    const pageData = this.getPageData();
    
    // Send to background script for processing
    chrome.runtime.sendMessage({
      action: 'pageAnalyzed',
      data: pageData
    });
  }

  getPageData() {
    return {
      title: document.title,
      url: window.location.href,
      content: document.body.innerText.substring(0, 5000),
      timestamp: new Date().toISOString(),
      domain: window.location.hostname,
      path: window.location.pathname
    };
  }

  analyzePage() {
    const pageData = this.getPageData();
    
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
      console.log('Page analysis result:', data);
      this.showAnalysisResult(data);
    })
    .catch(error => {
      console.error('Error analyzing page:', error);
    });
  }

  showAnalysisResult(analysis) {
    // Create analysis result overlay
    const overlay = document.createElement('div');
    overlay.id = 'cursorjarvis-analysis-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
      z-index: 10001;
      max-width: 500px;
      width: 90%;
    `;

    overlay.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h3 style="margin: 0; color: #1e293b;">Page Analysis Complete</h3>
        <button id="close-analysis" style="background: none; border: none; font-size: 24px; cursor: pointer;">×</button>
      </div>
      <div style="color: #475569; line-height: 1.6;">
        ${analysis.summary || 'Analysis completed successfully.'}
      </div>
      <div style="margin-top: 16px; display: flex; gap: 8px;">
        <button id="view-insights" style="background: #667eea; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
          View Insights
        </button>
        <button id="close-analysis-btn" style="background: #f1f5f9; color: #64748b; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
          Close
        </button>
      </div>
    `;

    document.body.appendChild(overlay);

    // Add event listeners
    document.getElementById('close-analysis').addEventListener('click', () => {
      overlay.remove();
    });

    document.getElementById('close-analysis-btn').addEventListener('click', () => {
      overlay.remove();
    });

    document.getElementById('view-insights').addEventListener('click', () => {
      this.showSidebar();
      overlay.remove();
    });

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (document.getElementById('cursorjarvis-analysis-overlay')) {
        overlay.remove();
      }
    }, 10000);
  }
}

// Initialize content script
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new CursorJarvisContentScript();
  });
} else {
  new CursorJarvisContentScript();
}
