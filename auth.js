// Authentication & Authorization Script
// Add this script to every page that requires login

(function() {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    
    // If not logged in and not on login page, redirect to login
    if (!user && !window.location.pathname.includes('login.html')) {
        window.location.href = '/login.html';
        return;
    }
    
    // If logged in and on login page, redirect to dashboard
    if (user && window.location.pathname.includes('login.html')) {
        window.location.href = '/dashboard.html';
        return;
    }
    
    // Add logout button to all pages (if user is logged in)
    if (user && !window.location.pathname.includes('login.html')) {
        addLogoutButton();
    }
    
    // Check page access based on role
    checkPageAccess(user);
})();

function addLogoutButton() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Create logout container
    const logoutContainer = document.createElement('div');
    logoutContainer.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: white;
        padding: 0.8rem 1.2rem;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        gap: 1rem;
        z-index: 999;
    `;
    
    logoutContainer.innerHTML = `
        <span style="color: #2c3e50; font-size: 0.9rem; font-weight: 500;">
            👋 ${user.fullName} (${user.role})
        </span>
        <button onclick="logout()" style="
            background: #e74c3c;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9rem;
            font-weight: 600;
        ">Logout</button>
    `;
    
    document.body.appendChild(logoutContainer);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    }
}

function checkPageAccess(user) {
    if (!user) return;
    
    // Define restricted pages for advisors (only admins can access)
    const adminOnlyPages = [
        'cash-flow.html'
    ];
    
    const currentPage = window.location.pathname.split('/').pop();
    
    // If advisor tries to access admin-only page, redirect
    if (user.role === 'advisor' && adminOnlyPages.includes(currentPage)) {
        alert('Access Denied: This page is only available to administrators.');
        window.location.href = '/dashboard.html';
    }
}

// Make logout available globally
window.logout = logout;
