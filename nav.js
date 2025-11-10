// nav.js - Universal Navigation Component (Growth Manager Pro)
// Role-based navigation with automatic active state detection and dynamic dashboard routing

const NavComponent = {
    // Menu structure with role permissions
    menuItems: {
        overview: [
            // Dynamic dashboard routing based on role - handled in render()
        ],
        core: [
            { name: 'Pre-Qual Calls', url: 'prequal-calls.html', icon: '📋', roles: ['admin', 'saas'] },
            { name: 'Podcast Calls', url: 'podcast-calls.html', icon: '🎙️', roles: ['admin', 'saas'] },
            { name: 'Discovery Calls', url: 'discovery-calls.html', icon: '🔍', roles: ['admin', 'saas'] },
            { name: 'Strategy Calls', url: 'strategy-calls.html', icon: '💼', roles: ['admin', 'saas'] },
            { name: 'Deals', url: 'deals.html', icon: '💰', roles: ['admin', 'saas'] },
            { name: 'Pipeline', url: 'pipeline.html', icon: '📊', roles: ['admin', 'saas'] }
        ],
        management: [
            { name: 'Contacts', url: 'contacts.html', icon: '👥', roles: ['admin', 'saas'] },
            { name: 'Campaigns', url: 'campaigns.html', icon: '📧', roles: ['admin', 'saas'] },
            { name: 'Sprints', url: 'sprints.html', icon: '⚡', roles: ['admin', 'saas'] }
        ],
        tools: [
            { name: 'Availability', url: 'availability.html', icon: '📅', roles: ['admin', 'saas'] },
            { name: 'Expense Tracker', url: 'expense-tracker.html', icon: '💵', roles: ['admin'] },
            { name: 'User Management', url: 'user-management.html', icon: '⚙️', roles: ['admin'] }
        ],
        profile: [
            { name: 'Settings', url: 'settings.html', icon: '⚙️', roles: ['admin', 'advisor', 'consultant', 'client', 'saas'] },
            { name: 'Edit Profile', url: 'edit-profile.html', icon: '👤', roles: ['admin', 'advisor', 'consultant', 'client', 'saas'] }
        ]
    },

    // Get current user from localStorage
    getCurrentUser() {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            return user;
        } catch (e) {
            console.error('Error getting user:', e);
            return null;
        }
    },

    // Check if user has permission for menu item
    hasPermission(item, userRole) {
        return item.roles.includes(userRole);
    },

    // Get current page
    getCurrentPage() {
        return window.location.pathname.split('/').pop() || 'dashboard.html';
    },

    // Get dashboard URL based on user role
    getDashboardUrl(userRole) {
        if (userRole === 'advisor' || userRole === 'consultant') {
            return 'advisor-dashboard.html';
        } else if (userRole === 'client') {
            return 'client-dashboard.html';
        } else {
            // admin, saas
            return 'dashboard.html';
        }
    },

    // Render navigation
    render() {
        const user = this.getCurrentUser();
        if (!user) {
            console.log('No user found, skipping nav render');
            return;
        }

        const userRole = user.role || user.user_type || 'client';
        const currentPage = this.getCurrentPage();
        
        // Get correct dashboard URL for this user's role
        const dashboardUrl = this.getDashboardUrl(userRole);
        
        // Add dashboard to overview section dynamically
        this.menuItems.overview = [
            { name: 'Dashboard', url: dashboardUrl, icon: '📊', roles: ['admin', 'advisor', 'consultant', 'client', 'saas'] }
        ];

        // Create nav container
        const nav = document.createElement('nav');
        nav.id = 'main-navigation';
        nav.style.cssText = `
            position: fixed;
            left: 0;
            top: 0;
            width: 250px;
            height: 100vh;
            background: white;
            border-right: 1px solid #e5e7eb;
            overflow-y: auto;
            z-index: 1000;
            padding: 1.5rem 0;
            box-shadow: 2px 0 8px rgba(0,0,0,0.05);
        `;

        let navHTML = '';

        // Render each section
        Object.keys(this.menuItems).forEach(section => {
            const items = this.menuItems[section];
            const filteredItems = items.filter(item => this.hasPermission(item, userRole));

            if (filteredItems.length > 0) {
                // Section header
                if (section !== 'overview') {
                    navHTML += `
                        <div style="
                            padding: 1rem 1.5rem 0.5rem;
                            color: #6b7280;
                            font-size: 0.75rem;
                            font-weight: 600;
                            text-transform: uppercase;
                            letter-spacing: 0.05em;
                        ">${section}</div>
                    `;
                }

                // Menu items
                filteredItems.forEach(item => {
                    const isActive = currentPage === item.url;
                    navHTML += `
                        <a href="/${item.url}" style="
                            display: flex;
                            align-items: center;
                            gap: 0.75rem;
                            padding: 0.75rem 1.5rem;
                            color: ${isActive ? '#2563eb' : '#374151'};
                            background: ${isActive ? '#eff6ff' : 'transparent'};
                            text-decoration: none;
                            transition: all 0.2s;
                            border-left: 3px solid ${isActive ? '#2563eb' : 'transparent'};
                            font-size: 0.875rem;
                            font-weight: ${isActive ? '600' : '400'};
                        " 
                        onmouseover="if (!this.querySelector('span:last-child').style.fontWeight || this.querySelector('span:last-child').style.fontWeight !== '600') { this.style.background='#f3f4f6'; }" 
                        onmouseout="this.style.background='${isActive ? '#eff6ff' : 'transparent'}';">
                            <span style="font-size: 1.2rem;">${item.icon}</span>
                            <span>${item.name}</span>
                        </a>
                    `;
                });
            }
        });

        // User info at bottom
        navHTML += `
            <div style="
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                padding: 1rem 1.5rem;
                border-top: 1px solid #e5e7eb;
                background: white;
            ">
                <div style="
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 0.75rem;
                ">
                    <div style="
                        width: 36px;
                        height: 36px;
                        border-radius: 50%;
                        background: #2563eb;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-weight: 600;
                        font-size: 0.875rem;
                    ">${(user.full_name || user.name || user.email || 'U').charAt(0).toUpperCase()}</div>
                    <div style="flex: 1; min-width: 0;">
                        <div style="
                            font-size: 0.875rem;
                            font-weight: 600;
                            color: #111827;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        ">${user.full_name || user.name || user.email.split('@')[0]}</div>
                        <div style="
                            font-size: 0.75rem;
                            color: #6b7280;
                            text-transform: capitalize;
                        ">${userRole}</div>
                    </div>
                </div>
                <button onclick="localStorage.clear(); window.location.href='/login.html';" style="
                    width: 100%;
                    padding: 0.5rem;
                    background: #ef4444;
                    color: white;
                    border: none;
                    border-radius: 0.375rem;
                    font-size: 0.875rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background 0.2s;
                " onmouseover="this.style.background='#dc2626'" onmouseout="this.style.background='#ef4444'">
                    Logout
                </button>
            </div>
        `;

        nav.innerHTML = navHTML;
        document.body.appendChild(nav);

        // Add left margin to main content
        const container = document.querySelector('.container');
        if (container) {
            container.style.marginLeft = '270px';
            container.style.transition = 'margin-left 0.3s';
        }
    },

    // Initialize - call this on page load
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.render());
        } else {
            this.render();
        }
    }
};

// Auto-initialize when script loads
NavComponent.init();
