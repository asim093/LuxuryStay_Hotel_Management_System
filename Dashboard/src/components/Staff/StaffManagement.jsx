import { useState, useEffect } from 'react';
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
  XCircle
} from 'lucide-react';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const roles = ['Manager', 'Receptionist', 'Housekeeping', 'Maintenance', 'Security'];
  const statuses = ['Active', 'Inactive'];

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = () => {
    const storedStaff = JSON.parse(localStorage.getItem('users') || '[]');
    setStaff(storedStaff);
  };

  const handleAddStaff = (staffData) => {
    const newStaff = {
      id: Date.now(),
      ...staffData,
      status: 'Active',
      createdAt: new Date().toISOString()
    };
    
    const updatedStaff = [...staff, newStaff];
    setStaff(updatedStaff);
    localStorage.setItem('users', JSON.stringify(updatedStaff));
    setShowAddModal(false);
  };

  const handleEditStaff = (staffData) => {
    const updatedStaff = staff.map(s => 
      s.id === editingStaff.id ? { ...s, ...staffData } : s
    );
    setStaff(updatedStaff);
    localStorage.setItem('users', JSON.stringify(updatedStaff));
    setShowEditModal(false);
    setEditingStaff(null);
  };

  const handleDeleteStaff = (staffId) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      const updatedStaff = staff.filter(s => s.id !== staffId);
      setStaff(updatedStaff);
      localStorage.setItem('users', JSON.stringify(updatedStaff));
    }
  };

  const handleStatusToggle = (staffId) => {
    const updatedStaff = staff.map(s => 
      s.id === staffId 
        ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' }
        : s
    );
    setStaff(updatedStaff);
    localStorage.setItem('users', JSON.stringify(updatedStaff));
  };

  const filteredStaff = staff.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || s.role === filterRole;
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (status) => {
    return status === 'Active' 
      ? <span className="badge badge-success badge-sm">Active</span>
      : <span className="badge badge-error badge-sm">Inactive</span>;
  };

  const getRoleBadge = (role) => {
    const colors = {
      'Manager': 'badge-primary',
      'Receptionist': 'badge-secondary',
      'Housekeeping': 'badge-accent',
      'Maintenance': 'badge-warning',
      'Security': 'badge-info'
    };
    return <span className={`badge ${colors[role] || 'badge-neutral'} badge-sm`}>{role}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600 mt-1">Manage your hotel staff members</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary mt-4 sm:mt-0"
        >
          <Plus size={20} className="mr-2" />
          Add Staff Member
        </button>
      </div>

      {/* Filters and Search */}
      <div className="card bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search staff..."
              className="input input-bordered w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="select select-bordered w-full"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          
          <select
            className="select select-bordered w-full"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterRole('all');
              setFilterStatus('all');
            }}
            className="btn btn-outline"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Staff Table */}
      <div className="card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Staff Member</th>
                <th>Role</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    <Users size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>No staff members found</p>
                    <p className="text-sm">Add your first staff member to get started</p>
                  </td>
                </tr>
              ) : (
                filteredStaff.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <User size={20} className="text-blue-600" />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{member.name}</div>
                          <div className="text-sm opacity-50">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{getRoleBadge(member.role)}</td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <Phone size={16} className="text-gray-400" />
                        <span className="text-sm">{member.phone}</span>
                      </div>
                    </td>
                    <td>{getStatusBadge(member.status)}</td>
                    <td>
                      <div className="text-sm text-gray-500">
                        {new Date(member.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
                          <MoreVertical size={16} />
                        </div>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                          <li>
                            <button
                              onClick={() => {
                                setEditingStaff(member);
                                setShowEditModal(true);
                              }}
                              className="flex items-center"
                            >
                              <Edit size={16} className="mr-2" />
                              Edit
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => handleStatusToggle(member.id)}
                              className="flex items-center"
                            >
                              {member.status === 'Active' ? (
                                <>
                                  <XCircle size={16} className="mr-2" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <CheckCircle size={16} className="mr-2" />
                                  Activate
                                </>
                              )}
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => handleDeleteStaff(member.id)}
                              className="flex items-center text-red-600"
                            >
                              <Trash2 size={16} className="mr-2" />
                              Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <AddStaffModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddStaff}
          roles={roles}
        />
      )}

      {/* Edit Staff Modal */}
      {showEditModal && editingStaff && (
        <EditStaffModal
          staff={editingStaff}
          onClose={() => {
            setShowEditModal(false);
            setEditingStaff(null);
          }}
          onEdit={handleEditStaff}
          roles={roles}
        />
      )}
    </div>
  );
};

// Add Staff Modal Component
const AddStaffModal = ({ onClose, onAdd, roles }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Receptionist'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Add New Staff Member</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div>
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              className="input input-bordered w-full"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          
          <div>
            <label className="label">
              <span className="label-text">Phone</span>
            </label>
            <input
              type="tel"
              className="input input-bordered w-full"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
          
          <div>
            <label className="label">
              <span className="label-text">Role</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          
          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Staff</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Staff Modal Component
const EditStaffModal = ({ staff, onClose, onEdit, roles }) => {
  const [formData, setFormData] = useState({
    name: staff.name,
    email: staff.email,
    phone: staff.phone,
    role: staff.role
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onEdit(formData);
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Edit Staff Member</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div>
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              className="input input-bordered w-full"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          
          <div>
            <label className="label">
              <span className="label-text">Phone</span>
            </label>
            <input
              type="tel"
              className="input input-bordered w-full"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
          
          <div>
            <label className="label">
              <span className="label-text">Role</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          
          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Update Staff</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffManagement;
