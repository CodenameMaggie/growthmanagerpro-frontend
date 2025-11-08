// auth-helper.js - Enhanced authentication helper with Supabase session support
// This integrates with your permissions.js system AND Supabase Auth

const AuthHelper = {
  // Initialize Supabase client (call this once at app startup)
  supabaseClient: null,

  initSupabase: function(supabaseUrl, supabaseAnonKey) {
    if (typeof supabase !== 'undefined') {
      this.supabaseClient = supabase.createClient(supabaseUrl, supabaseAnonKey);
      
      // Check for existing session and restore it
      const storedSession = localStorage.getItem('supabase_session');
      if (storedSession) {
        try {
          const session = JSON.parse(storedSession);
          this.supabaseClient.auth.setSession(session);
        } catch (e) {
          console.error('Failed to restore Supabase session:', e);
        }
      }
    }
  },

  // Get current user from localStorage (backward compatible)
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

  // Get Supabase auth session
  getSupabaseSession: async function() {
    if (!this.supabaseClient) return null;
    
    try {
      const { data, error } = await this.supabaseClient.auth.getSession();
      if (error) {
        console.error('Error getting Supabase session:', error);
        return null;
      }
      return data.session;
    } catch (e) {
      console.error('Failed to get Supabase session:', e);
      return null;
    }
  },

  // Check if user is logged in (checks both localStorage and Supabase)
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
      advisor: ['advisor-dashboard.view'],  // ← From login.js
      'contacts.html': 'contacts.view',
      'podcast-calls.html': 'calls.view',
      'podcast-interviews.html': 'calls.view',
      'discovery-calls.html': 'calls.view',
      'strategy-calls.html': 'calls.view',
      'pipeline.html': 'pipeline.view',
      'deals.html': 'deals.view',
      'cash-flow.html': 'financials.view',
      'campaigns.html': 'campaigns.view',
      'sprints.html': 'sprints.view',
      'availability.html': 'sprints.view',
      'expense-tracker.html': 'financials.view',
      'user-management.html': 'users.view',
      'client-portal.html': 'dashboard.view',
      'analytics.html': 'dashboard.view',
      'reports.html': 'dashboard.view'
    };
    
    const requiredPermission = pagePermissions[pageName];
    
    // If no specific permission required, allow access
    if (!requiredPermission) return true;
    
    // Check if user has the required permission
    return this.hasPermission(requiredPermission);
  },

  // Protect a page - call this at the start of page load
  protectPage: function(pageName) {
    console.log('[Auth] Protecting page:', pageName);
    
    // First check if logged in
    if (!this.requireAuth()) {
      console.log('[Auth] Not logged in, redirecting to login');
      return false;
    }
    
    const user = this.getCurrentUser();
    console.log('[Auth] Current user:', user.email, 'Role:', user.role);
    
    // Then check if user can access this specific page
    if (!this.canAccessPage(pageName)) {
      console.log('[Auth] User does not have permission for:', pageName);
      alert('You do not have permission to access this page.');
      
      // Redirect based on user type
      if (user.type === 'client') {
        window.location.href = '/client-portal.html';
      } else {
        window.location.href = '/dashboard.html';
      }
      return false;
    }
    
    console.log('[Auth] Page access granted');
    return true;
  },

  // Logout user (clears both localStorage and Supabase session)
  logout: async function() {
    // Sign out from Supabase
    if (this.supabaseClient) {
      try {
        await this.supabaseClient.auth.signOut();
      } catch (e) {
        console.error('Error signing out from Supabase:', e);
      }
    }
    
    // Clear local storage
    localStorage.removeItem('user');
    localStorage.removeItem('supabase_session');
    
    // Redirect to login
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

    console.log('[Auth] Applying permissions for:', user.role);

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
  },

  // Get authenticated Supabase client for API calls
  getAuthenticatedClient: function() {
    return this.supabaseClient;
  }
};

// Example usage in your HTML pages:
/*

<!-- Load Supabase client first (if you want to use Supabase features) -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<!-- Then load auth-helper -->
<script src="auth-helper.js"></script>

<script>
  // Initialize Supabase (optional, for enhanced features)
  AuthHelper.initSupabase('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');
  
  // Protect this page - only allow users with proper permissions
  
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
