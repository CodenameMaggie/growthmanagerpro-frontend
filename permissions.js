// permissions.js - Granular Permission System for Growth Manager Pro

const PermissionSystem = {
  permissions: {
    'dashboard.view': 'View main dashboard',
    'dashboard.edit': 'Edit dashboard widgets',
    'contacts.view': 'View contacts',
    'contacts.create': 'Create new contacts',
    'contacts.edit': 'Edit contacts',
    'contacts.delete': 'Delete contacts',
    'calls.view': 'View all calls',
    'calls.create': 'Schedule calls',
    'calls.edit': 'Edit call details',
    'calls.delete': 'Delete calls',
    'deals.view': 'View deals',
    'deals.create': 'Create deals',
    'deals.edit': 'Edit deals',
    'deals.delete': 'Delete deals',
    'pipeline.view': 'View pipeline',
    'pipeline.edit': 'Modify pipeline stages',
    'campaigns.view': 'View campaigns',
    'campaigns.create': 'Create campaigns',
    'campaigns.edit': 'Edit campaigns',
    'campaigns.delete': 'Delete campaigns',
    'financials.view': 'View financial data',
    'financials.edit': 'Edit financial data',
    'sprints.view': 'View sprints',
    'sprints.create': 'Create sprints',
    'sprints.edit': 'Edit sprints',
    'sprints.delete': 'Delete sprints',
    'users.view': 'View users',
    'users.create': 'Create users',
    'users.edit': 'Edit users',
    'users.delete': 'Delete users',
    'users.permissions': 'Manage user permissions'
  },

  roles: {
    'admin': {
      name: 'Administrator',
      description: 'Full system access',
      permissions: 'all'
    },
    'manager': {
      name: 'Manager',
      description: 'Manage operations and view reports',
      permissions: [
        'dashboard.view', 'dashboard.edit', 'contacts.view', 'contacts.create',
        'contacts.edit', 'calls.view', 'calls.create', 'calls.edit',
        'deals.view', 'deals.create', 'deals.edit', 'pipeline.view',
        'pipeline.edit', 'campaigns.view', 'campaigns.create', 'campaigns.edit',
        'financials.view', 'sprints.view', 'sprints.create', 'sprints.edit',
        'users.view'
      ]
    },
    'client': {
      name: 'Client',
      description: 'View own data only',
      permissions: [
        'dashboard.view', 'contacts.view', 'calls.view', 'deals.view',
        'pipeline.view', 'financials.view'
      ]
    }
  },

  hasPermission: function(userPermissions, requiredPermission) {
    if (!userPermissions) return false;
    if (userPermissions === 'all') return true;
    if (Array.isArray(userPermissions)) {
      return userPermissions.includes(requiredPermission);
    }
    return false;
  },

  canAccessPage: function(userPermissions, pageName) {
    const pagePermissions = {
      'dashboard.html': ['dashboard.view'],
      'contacts.html': ['contacts.view'],
      'podcast-calls.html': ['calls.view'],
      'discovery-calls.html': ['calls.view'],
      'sales-calls.html': ['calls.view'],
      'pipeline.html': ['pipeline.view'],
      'deals.html': ['deals.view'],
      'cash-flow.html': ['financials.view'],
      'campaigns.html': ['campaigns.view'],
      'sprints.html': ['sprints.view'],
      'user-management.html': ['users.view']
    };
    const required = pagePermissions[pageName];
    if (!required) return true;
    return this.hasPermission(userPermissions, required[0]);
  }
};
