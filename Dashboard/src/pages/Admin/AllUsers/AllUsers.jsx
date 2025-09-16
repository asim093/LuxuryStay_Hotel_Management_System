import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingUser, setUpdatingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const token = useSelector((state) => state.user?.data?.user?.token || state.user?.token);

  const validRoles = ['Admin', 'Manager', 'Receptionist', "Staff", 'Housekeeping', 'Guest'];

  const isValidJWT = (token) => {
    if (!token) return false;
    const parts = token.split('.');
    return parts.length === 3 && parts.every(part => part.length > 0);
  };

  const getCleanToken = () => {
    if (!token) return null;

    const cleanToken = token.replace(/^Bearer\s+/i, '').trim();

    if (!isValidJWT(cleanToken)) {
      console.error('Invalid JWT format:', cleanToken);
      return null;
    }

    return cleanToken;
  };

  const showToast = useCallback((message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 z-50 transform transition-all duration-300 translate-x-full';
    toast.innerHTML = `
      <div class="flex items-center bg-white shadow-lg rounded-lg p-4 border-l-4 ${type === 'success' ? 'border-green-500' : 'border-red-500'
      }">
        <div class="flex-shrink-0 mr-3">
          ${type === 'success'
        ? '<svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>'
        : '<svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>'
      }
        </div>
        <div class="text-sm font-medium text-gray-800">${message}</div>
      </div>
    `;

    document.body.appendChild(toast);
    setTimeout(() => toast.classList.remove('translate-x-full'), 100);
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  }, []);

  const fetchUsers = useCallback(async () => {
    const cleanToken = getCleanToken();

    if (!cleanToken) {
      setError('Invalid authentication token. Please login again.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/user/users', {
        headers: {
          'Authorization': `Bearer ${cleanToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        setError('Session expired. Please login again.');
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setUsers(data.users || []);
        setError('');
      } else {
        setError(data.message || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const updateUserRole = useCallback(async (userId, newRole) => {
    const cleanToken = getCleanToken();

    if (!cleanToken) {
      showToast('Invalid authentication token. Please login again.', 'error');
      return;
    }

    try {
      setUpdatingUser(userId);
      const response = await fetch(`http://localhost:3001/api/user/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${cleanToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.status === 401) {
        showToast('Session expired. Please login again.', 'error');
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user._id === userId ? { ...user, role: newRole } : user
          )
        );
        showToast('User role updated successfully!', 'success');
      } else {
        showToast(data.message || 'Failed to update user role', 'error');
      }
    } catch (err) {
      console.error('Update role error:', err);
      showToast('Network error occurred', 'error');
    } finally {
      setUpdatingUser(null);
    }
  }, [token, showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Memoized filtered and sorted users
  const filteredUsers = useMemo(() => {
    let filtered = users.filter(user => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = selectedRole === 'all' || user.role === selectedRole;

      return matchesSearch && matchesRole;
    });

    filtered.sort((a, b) => {
      let aVal = a[sortBy] || '';
      let bVal = b[sortBy] || '';

      if (sortBy === 'createdAt') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else {
        aVal = aVal.toString().toLowerCase();
        bVal = bVal.toString().toLowerCase();
      }

      const comparison = aVal > bVal ? 1 : -1;
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [users, searchTerm, selectedRole, sortBy, sortOrder]);

  // Memoized role statistics
  const roleStats = useMemo(() => {
    return validRoles.map(role => ({
      role,
      count: users.filter(user => user.role === role).length
    }));
  }, [users]);

  const getRoleColor = (role) => {
    const colors = {
      'Admin': 'bg-red-100 text-red-800 border-red-200',
      'Manager': 'bg-blue-100 text-blue-800 border-blue-200',
      'Receptionist': 'bg-green-100 text-green-800 border-green-200',
      'Housekeeping': 'bg-purple-100 text-purple-800 border-purple-200',
      'Staff': 'bg-purple-200 text-purple-500 border-purple-500',
      'Guest': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[role] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (!token || !getCleanToken()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">Authentication Required</h2>
            <p className="mt-2 text-gray-600">
              {!token ? 'Please log in to access the user management panel.' : 'Invalid authentication token. Please log in again.'}
            </p>
            <button
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => window.location.href = '/login'}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-lg font-medium text-gray-900">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600">Manage user roles and permissions</p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-blue-600">{users.length}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
          {roleStats.map(({ role, count }) => (
            <div key={role} className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-sm text-gray-600">{role}s</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="all">All Roles</option>
                {validRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>

              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
              >
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="email-asc">Email A-Z</option>
                <option value="role-asc">Role A-Z</option>
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
              </select>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-700">
                Showing {filteredUsers.length} of {users.length} users
              </span>
              <button
                onClick={fetchUsers}
                disabled={loading}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setError('')}
                  className="inline-flex text-red-400 hover:text-red-600"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {searchTerm || selectedRole !== 'all'
                          ? 'Try adjusting your search filters'
                          : 'Get started by adding a new user'
                        }
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name || 'No Name'}
                            </div>
                            <div className="text-xs text-gray-500 font-mono">
                              ID: {user._id?.slice(-8)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                        {user.phone && (
                          <div className="text-xs text-gray-500">{user.phone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="relative inline-block text-left">
                          <select
                            value={user.role}
                            onChange={(e) => updateUserRole(user._id, e.target.value)}
                            disabled={updatingUser === user._id}
                            className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                          >
                            {validRoles.map((role) => (
                              <option key={role} value={role}>{role}</option>
                            ))}
                          </select>
                          {updatingUser === user._id && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-md">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;