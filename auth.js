// auth-helper.js - Add this to every page that requires authentication
// This integrates with your permissions.js system

const AuthHelper = {
  // Get current user from localStorage
  getCurrentUser: function() {
    const userData = localStorage.getItem('user');
    if (!userData) return null;
    
    try {
      return JSON.parse(userData);
    } catch (e) {
      console.error('Invalid user data in localStorage');
      localStorage.removeItem('user');
      return null;
    }
  },

  // Check if user is logged in
  isLoggedIn: function() {
    return this.getCurrentUser() !== null;
  },

  // Require authentication - redirect to login if not logged in
  requireAuth: function() {
    if (!this.isLoggedIn()) {
      window.location.href = '/login.html';
      return false;
    }
    return true;
  },

  // Check if user has a specific permission
  hasPermission: function(permission) {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    const userPermissions = user.permissions;
    
    // Admin has all permissions
    if (userPermissions === 'all') return true;
    
    // Check if permission is in user's permission array
    if (Array.isArray(userPermissions)) {
      return userPermissions.includes(permission);
    }
    
    return false;
  },

  // Check if user can access current page
  canAccessPage: function(pageName) {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    // Map pages to required permissions
    const pagePermissions = {
      'dashboard.html': 'dashboard.view',
      'contacts.html': 'contacts.view',
      'podcast-calls.html': 'calls.view',
      'discovery-calls.html': 'calls.view',
      'sales-calls.html': 'calls.view',
      'pipeline.html': 'pipeline.view',
      'deals.html': 'deals.view',
      'cash-flow.html': 'financials.view',
      'campaigns.html': 'campaigns.view',
      'sprints.html': 'sprints.view',
      'expense-tracker.html': 'financials.view',
      'user-management.html': 'users.view',
      'client-portal.html': 'dashboard.view' // Clients can access their portal
    };
    
    const requiredPermission = pagePermissions[pageName];
    
    // If no specific permission required, allow access
    if (!requiredPermission) return true;
    
    // Check if user has the required permission
    return this.hasPermission(requiredPermission);
  },

  // Protect a page - call this at the start of page load
  protectPage: function(pageName) {
    // First check if logged in
    if (!this.requireAuth()) return false;
    
    // Then check if user can access this specific page
    if (!this.canAccessPage(pageName)) {
      alert('You do not have permission to access this page.');
      
      // Redirect based on user type
      const user = this.getCurrentUser();
      if (user.type === 'client') {
        window.location.href = '/client-portal.html';
      } else {
        window.location.href = '/dashboard.html';
      }
      return false;
    }
    
    return true;
  },

  // Logout user
  logout: function() {
    localStorage.removeItem('user');
    window.location.href = '/login.html';
  },

  // Get user's role
  getUserRole: function() {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  },

  // Check if user is admin
  isAdmin: function() {
    const user = this.getCurrentUser();
    return user && user.role === 'admin';
  },

  // Check if user is client
  isClient: function() {
    const user = this.getCurrentUser();
    return user && user.type === 'client';
  },

  // Show/hide elements based on permissions
  applyPermissions: function() {
    const user = this.getCurrentUser();
    if (!user) return;

    // Hide elements that require specific permissions
    document.querySelectorAll('[data-requires-permission]').forEach(element => {
      const requiredPermission = element.getAttribute('data-requires-permission');
      if (!this.hasPermission(requiredPermission)) {
        element.style.display = 'none';
      }
    });

    // Hide elements that require admin access
    document.querySelectorAll('[data-admin-only]').forEach(element => {
      if (!this.isAdmin()) {
        element.style.display = 'none';
      }
    });

    // Hide elements from clients
    document.querySelectorAll('[data-hide-from-client]').forEach(element => {
      if (this.isClient()) {
        element.style.display = 'none';
      }
    });
  }
};

// Example usage in your HTML pages:
/*

<!-- Add at the start of your page's <script> section: -->
<script>
  // Protect this page - only allow users with proper permissions
  AuthHelper.protectPage('dashboard.html'); // Change to match your page name
  
  // Apply permissions to UI elements
  AuthHelper.applyPermissions();
  
  // Get current user info
  const currentUser = AuthHelper.getCurrentUser();
  console.log('Current user:', currentUser.name, 'Role:', currentUser.role);
</script>

<!-- In your HTML, mark elements that need permission checks: -->

<!-- This button only shows if user has 'contacts.create' permission -->
<button data-requires-permission="contacts.create" onclick="createContact()">
  New Contact
</button>

<!-- This section only shows to admins -->
<div data-admin-only>
  <h3>Admin Settings</h3>
  <p>Only administrators can see this</p>
</div>

<!-- This is hidden from clients -->
<nav data-hide-from-client>
  <a href="/user-management.html">User Management</a>
</nav>

*/
