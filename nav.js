// Navigation Bar Script
// Add this after auth.js on all pages
(function() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addNavBar);
    } else {
        addNavBar();
    }
})();

function addNavBar() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) return; // Don't show nav if not logged in
    
    // Create nav container
    const nav = document.createElement('div');
    nav.style.cssText = `
        position: fixed;
        top: 80px;
        left: 0;
        width: 250px;
        height: calc(100vh - 80px);
        background: #2c3e50;
        padding: 1.5rem 0;
        overflow-y: auto;
        z-index: 998;
        box-shadow: 2px 0 10px rgba(0,0,0,0.1);
    `;
    
    const currentPage = window.location.pathname.split('/').pop();
    
    // Navigation items
    const navItems = [
        { name: 'Dashboard', url: 'dashboard.html', icon: '📊' },
        { name: 'Podcast Calls', url: 'podcast-calls.html', icon: '🎙️' },
        { name: 'Discovery Calls', url: 'discovery-calls.html', icon: '📞' },
        { name: 'strategy Calls', url: 'strategy-calls.html', icon: '💼' },
        { name: 'Pipeline', url: 'pipeline.html', icon: '🔄' },
        { name: 'Contacts', url: 'contacts.html', icon: '👥' },
        { name: 'Deals', url: 'deals.html', icon: '💰' },
        { name: 'Campaigns', url: 'campaigns.html', icon: '📢' },
        { name: 'Sprints', url: 'sprints.html', icon: '✅' }
    ];
    
    // Add Cash Flow only for admin
    if (user.role === 'admin') {
        navItems.push({ name: 'Cash Flow', url: 'cash-flow.html', icon: '💵' });
        navItems.push({ name: 'User Management', url: 'user-management.html', icon: '⚙️' });
    }
    
    // Build navigation HTML
    let navHTML = '<div style="padding: 0 1rem; margin-bottom: 1rem; color: #ecf0f1; font-size: 0.8rem; text-transform: uppercase; font-weight: 600;">Navigation</div>';
    
    navItems.forEach(item => {
        const isActive = currentPage === item.url;
        navHTML += `
            <a href="/${item.url}" style="
                display: flex;
                align-items: center;
                gap: 0.8rem;
                padding: 0.9rem 1.5rem;
                color: ${isActive ? '#fff' : '#bdc3c7'};
                background: ${isActive ? '#34495e' : 'transparent'};
                text-decoration: none;
                transition: all 0.2s;
                border-left: 3px solid ${isActive ? '#3498db' : 'transparent'};
                font-size: 0.95rem;
                font-weight: ${isActive ? '600' : '400'};
            " onmouseover="this.style.background='#34495e'; this.style.color='#fff';" onmouseout="this.style.background='${isActive ? '#34495e' : 'transparent'}'; this.style.color='${isActive ? '#fff' : '#bdc3c7'}';">
                <span style="font-size: 1.2rem;">${item.icon}</span>
                <span>${item.name}</span>
            </a>
        `;
    });
    
    nav.innerHTML = navHTML;
    document.body.appendChild(nav);
    
    // Add left margin to main content
    const container = document.querySelector('.container');
    if (container) {
        container.style.marginLeft = '270px';
        container.style.transition = 'margin-left 0.3s';
    }
}
