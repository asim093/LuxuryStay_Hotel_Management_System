import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  MoreVertical,
  User,
  Mail,
  Phone,
  Building,
  CheckCircle,
  XCircle,
  Check,
  AlertCircle,
  UserCheck,
  UserX,
  Calendar,
  Shield,
  Settings,
  Home,
  Sparkles
} from 'lucide-react';
import { toast } from 'react-toastify';
import useCallpostApi from '../../../Hooks/useCallpostApi';
import useCallgetApi from '../../../Hooks/useCallgetApi';
import Modal from '../../../components/Modal/Modal';

const HouseKeeping = () => {
  const [housekeeping, setHousekeeping] = useState([]);
  const [modal, setModal] = useState({
    show: false,
    mode: null,
    data: null
  });
  const [formErrors, setFormErrors] = useState({});
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    status: 'all'
  });

  // Separate API hooks for each operation
  const { response: getResponse, loading: getLoading, error: getError, Apicall: getApiCall } = useCallgetApi();
  
  // Add operation hook
  const { 
    response: addResponse, 
    loading: addLoading, 
    error: addError, 
    ApiCall: addApiCall 
  } = useCallpostApi();
  
  // Edit operation hook
  const { 
    response: editResponse, 
    loading: editLoading, 
    error: editError, 
    ApiCall: editApiCall 
  } = useCallpostApi();
  
  // Delete operation hook
  const { 
    response: deleteResponse, 
    loading: deleteLoading, 
    error: deleteError, 
    ApiCall: deleteApiCall 
  } = useCallpostApi();
  
  // Status toggle hook
  const { 
    response: statusResponse, 
    loading: statusLoading, 
    error: statusError, 
    ApiCall: statusApiCall 
  } = useCallpostApi();

  const statuses = [
    { value: true, label: 'Active', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    { value: false, label: 'Inactive', color: 'bg-gray-100 text-gray-800', icon: XCircle }
  ];

  const getFormFields = (mode) => {
    const baseFields = [
      { name: 'name', label: 'Full Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
    ];

    if (mode === 'add') {
      baseFields.push({ name: 'password', label: 'Password', type: 'password', required: true });
    } else if (mode === 'edit') {
      baseFields.push({ name: 'password', label: 'Password', type: 'password', required: false });
    }

    return baseFields;
  };

  useEffect(() => {
    loadHousekeeping();
  }, []);

  const loadHousekeeping = async () => {
    try {
      const data = await getApiCall('/api/user/users/Housekeeping', 'GET');
      if (data && data.users) {
        setHousekeeping(data.users);
      }
    } catch (error) {
      console.error('Failed to load housekeeping staff:', error);
    }
  };

  const openModal = (mode, data = null) => {
    console.log('openModal called with:', mode, data);
    setModal({ show: true, mode, data });
    setFormErrors({});
  };

  const closeModal = () => {
    setModal({ show: false, mode: null, data: null });
    setFormErrors({});
  };

  const validateForm = (formData) => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    }

    if (modal.mode === 'add' && (!formData.password || formData.password.length < 6)) {
      errors.password = 'Password is required and must be at least 6 characters';
    } else if (formData.password && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddHousekeeping = async (housekeepingData) => {
    console.log('handleAddHousekeeping called with:', housekeepingData);
    if (!validateForm(housekeepingData)) {
      console.log('Form validation failed');
      return;
    }

    try {
      console.log('Making API call for add housekeeping');
      await addApiCall({
        url: '/api/user/Adduser',
        method: 'POST',
        body: {
          ...housekeepingData,
          role: "Housekeeping"
        }
      });
      console.log('API call completed');
    } catch (error) {
      console.error('Add housekeeping error:', error);
    }
  };

  const handleEditHousekeeping = async (housekeepingData) => {
    if (!validateForm(housekeepingData)) return;

    try {
      if (!housekeepingData.password) {
        delete housekeepingData.password;
      }

      await editApiCall({
        url: `/api/user/users/${modal.data._id || modal.data.id}`,
        method: 'PUT',
        body: housekeepingData
      });
      loadHousekeeping();
      closeModal()
    } catch (error) {
      console.error('Edit housekeeping error:', error);
    }
  };

  const handleDeleteHousekeeping = async ({ id }) => {
    try {
      await deleteApiCall({
        url: `/api/user/${id}/users`,
        method: 'DELETE',
        body: null
      });
      loadHousekeeping();
      closeModal()
    } catch (error) {
      console.error('Delete housekeeping error:', error);
    }
  };

  const handleModalSubmit = (data) => {
    console.log('handleModalSubmit called with:', data, 'mode:', modal.mode);
    if (modal.mode === 'add') {
      handleAddHousekeeping(data);
    } else if (modal.mode === 'edit') {
      handleEditHousekeeping(data);
    } else if (modal.mode === 'delete') {
      handleDeleteHousekeeping(data);
    }
  };

  const handleStatusToggle = async (housekeepingId, currentStatus) => {
    const newStatus = currentStatus === true ? 'Inactive' : 'Active';

    try {
      await statusApiCall({
        url: `/api/user/users/${housekeepingId}/status`,
        method: 'PATCH',
        body: { status: newStatus }
      });
      loadHousekeeping();
      closeModal()
    } catch (error) {
      console.error('Status toggle error:', error);
    }
  };

  useEffect(() => {
    console.log('addResponse useEffect triggered:', addResponse);
    if (addResponse) {
      if (addResponse.status === 'success') {
        toast.success('Housekeeping staff added successfully');
        closeModal();
        // Force refetch after add
        setTimeout(() => {
          loadHousekeeping();
        }, 100);
      } else {
        toast.error(addResponse.message || 'Failed to add housekeeping staff');
      }
    }
  }, [addResponse]);

  useEffect(() => {
    console.log('addError useEffect triggered:', addError);
    if (addError) {
      toast.error(addError.message || 'Failed to add housekeeping staff');
    }
  }, [addError]);

  // Edit Housekeeping Success/Error Handlers
  useEffect(() => {
    if (editResponse) {
      if (editResponse.status === 'success') {
        toast.success('Housekeeping staff updated successfully');
        closeModal();
        // Force refetch after edit
        setTimeout(() => {
          loadHousekeeping();
        }, 100);
      } else {
        toast.error(editResponse.message || 'Failed to update housekeeping staff');
      }
    }
  }, [editResponse]);

  useEffect(() => {
    if (editError) {
      toast.error(editError.message || 'Failed to update housekeeping staff');
    }
  }, [editError]);

  // Delete Housekeeping Success/Error Handlers
  useEffect(() => {
    if (deleteResponse) {
      if (deleteResponse.status === 'success') {
        toast.success('Housekeeping staff deleted successfully');
        closeModal(); // ✅ Modal close karo
        setTimeout(() => {
          loadHousekeeping(); // ✅ Data refetch with slight delay
        }, 100);
      } else {
        toast.error(deleteResponse.message || 'Failed to delete housekeeping staff');
      }
    }
  }, [deleteResponse]);

  useEffect(() => {
    if (deleteError) {
      toast.error(deleteError.message || 'Failed to delete housekeeping staff');
    }
  }, [deleteError]);

  // Status Toggle Success/Error Handlers
  useEffect(() => {
    if (statusResponse) {
      if (statusResponse.status === 'success') {
        toast.success('Status updated successfully');
        // Force refetch after status change
        setTimeout(() => {
          loadHousekeeping();
        }, 100);
      } else {
        toast.error(statusResponse.message || 'Failed to update status');
      }
    }
  }, [statusResponse]);

  useEffect(() => {
    if (statusError) {
      toast.error(statusError.message || 'Failed to update status');
    }
  }, [statusError]);

  const filteredHousekeeping = housekeeping.filter(h => {
    const matchesSearch = !filters.search ||
      h.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      h.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      h.phone.includes(filters.search);

    const matchesRole = filters.role === 'all' || h.role === filters.role;
    const matchesStatus = filters.status === 'all' || h.status === filters.status;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusInfo = (isActive) => {
    return statuses.find(s => s.value === isActive) || statuses[0];
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      role: 'all',
      status: 'all'
    });
  };

  const getModalTitle = () => {
    switch (modal.mode) {
      case 'add': return 'Add New Housekeeping Staff';
      case 'edit': return 'Edit Housekeeping Staff';
      case 'delete': return 'Delete Housekeeping Staff';
      default: return '';
    }
  };

  const getModalSubtitle = () => {
    switch (modal.mode) {
      case 'add': return 'Create a new housekeeping staff member with complete details';
      case 'edit': return 'Update housekeeping staff information and settings';
      case 'delete': return 'This action cannot be undone';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Sparkles className="h-8 w-8 text-purple-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Housekeeping Management</h1>
              </div>
              <p className="text-gray-600">Manage your hotel housekeeping staff members and their roles efficiently</p>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={() => {
                  console.log('Add housekeeping button clicked');
                  alert('Button clicked!'); // Visual confirmation
                  openModal('add');
                }}
                className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-sm transition-all duration-200 gap-2 w-full lg:w-auto cursor-pointer"
                disabled={addLoading}
                style={{ pointerEvents: 'auto', zIndex: 10 }}
              >
                {addLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    Add Housekeeping Staff
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Filter Housekeeping Staff</h2>
            <p className="text-sm text-gray-600">Use filters to find specific housekeeping staff members quickly</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Staff
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, email, phone..."
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="all">All Status</option>
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Housekeeping</p>
                <p className="text-2xl font-bold text-gray-900">{housekeeping.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{housekeeping.filter(h => h.isActive === true).length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-red-600">{housekeeping.filter(h => h.isActive === false).length}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <UserX className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {getLoading && (
          <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
              <p className="text-gray-600">Loading housekeeping staff...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {getError && !getLoading && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading housekeeping staff</h3>
            <p className="text-gray-600 mb-6">{getError.message}</p>
            <button
              onClick={loadHousekeeping}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors gap-2"
            >
              <Search size={16} />
              Retry
            </button>
          </div>
        )}

        {/* Housekeeping Grid/List */}
        {!getLoading && !getError && (
          <>
            {filteredHousekeeping.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                <Sparkles className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No housekeeping staff found</h3>
                <p className="text-gray-600 mb-6">Get started by adding your first housekeeping staff member.</p>
                <button
                  onClick={() => {
                   
                    openModal('add');
                  }}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors gap-2 cursor-pointer"
                  style={{ pointerEvents: 'auto' }}
                >
                  <Plus size={16} />
                  Add Housekeeping Staff
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHousekeeping.map((member) => {
                  const statusInfo = getStatusInfo(member.isActive);

                  return (
                    <div key={member._id || member.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
                      <div className="p-6">
                        {/* Staff Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{member.name}</h3>
                              <p className="text-sm text-gray-600">{member.email}</p>
                            </div>
                          </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2 mb-6">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone size={16} />
                            <span>{member.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar size={16} />
                            <span>Joined {new Date(member.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal('edit', member)}
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors gap-2"
                            disabled={editLoading}
                          >
                            {editLoading ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
                            ) : (
                              <>
                                <Edit size={16} />
                                Edit
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleStatusToggle(member._id || member.id, member.isActive)}
                            className={`inline-flex items-center justify-center px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${member.isActive === false
                              ? 'border-red-300 text-red-700 bg-white hover:bg-red-50'
                              : 'border-green-300 text-green-700 bg-white hover:bg-green-50'
                              }`}
                            disabled={statusLoading}
                          >
                            {statusLoading ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                            ) : (
                              <>
                                {member.isActive === false ? <UserX size={16} /> : <UserCheck size={16} />}
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => openModal('delete', member)}
                            className="inline-flex items-center justify-center px-3 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50 transition-colors"
                            disabled={deleteLoading}
                          >
                            {deleteLoading ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700"></div>
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {modal.show && (
        <Modal
          title={getModalTitle()}
          subtitle={getModalSubtitle()}
          mode={modal.mode}
          data={modal.data}
          fields={modal.mode !== 'delete' ? getFormFields(modal.mode) : null}
          onClose={closeModal}
          onSubmit={handleModalSubmit}
          loading={addLoading || editLoading || deleteLoading}
          errors={formErrors}
        />
      )}
    </div>
  );
};

export default HouseKeeping;