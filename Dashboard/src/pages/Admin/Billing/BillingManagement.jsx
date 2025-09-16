import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Plus, Download, FileText, Search, Calendar, CheckCircle, XCircle, RefreshCw, CreditCard, ArrowDownLeft, ArrowUpRight, Mail, MoreHorizontal, Eye, DollarSign } from 'lucide-react';
import { toast } from 'react-toastify';
import Modal from '../../../components/Modal/Modal';

const ActionsDropdown = ({ row, onAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const actions = [
    { id: 'payment', label: 'Add Payment', icon: CreditCard, color: 'text-blue-600' },
    { id: 'refund', label: 'Add Refund', icon: ArrowDownLeft, color: 'text-orange-600' },
    { id: 'invoice', label: 'View Invoice', icon: FileText, color: 'text-gray-600' },
    { id: 'mark-paid', label: 'Mark as Paid', icon: CheckCircle, color: 'text-green-600' },
    { id: 'mark-pending', label: 'Mark as Pending', icon: XCircle, color: 'text-yellow-600' },
  ];

  const handleAction = (actionId) => {
    onAction(actionId, row);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <MoreHorizontal size={16} />
      </button>

      {/* Dropdown - Fixed positioning */}
      {isOpen && (
        <div 
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg min-w-48 z-50"
          style={{
            top: (dropdownRef.current?.getBoundingClientRect().bottom || 0) + 8,
            left: Math.max(
              8, // Minimum 8px from left edge
              Math.min(
                (dropdownRef.current?.getBoundingClientRect().right || 0) - 192, // Align to right of button, 192px = 12rem (w-48)
                window.innerWidth - 200 // Don't go beyond right edge
              )
            ),
          }}
        >
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => handleAction(action.id)}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg text-left"
              >
                <Icon size={14} className={action.color} />
                <span className="text-gray-700">{action.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};


const BillingManagement = () => {
  const token = useSelector((s) => s.user.token);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ q: '', status: '', from: '', to: '' });
  const [modal, setModal] = useState({ show: false, mode: null, data: null });
  const [invoice, setInvoice] = useState(null);

  const fetchBilling = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.q) params.append('q', filters.q);
      if (filters.status) params.append('status', filters.status);
      if (filters.from) params.append('from', filters.from);
      if (filters.to) params.append('to', filters.to);
      const res = await fetch(`http://localhost:3001/api/billing?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to load billing');
      const data = await res.json();
      setRows(data.rows || []);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load billing records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBilling();
    // eslint-disable-next-line
  }, []);

  const clearFilters = () => setFilters({ q: '', status: '', from: '', to: '' });

  const filteredRows = useMemo(() => {
    return rows.filter(r => {
      const mQ = !filters.q || (
        r.bookingNumber?.toLowerCase().includes(filters.q.toLowerCase()) ||
        r.guestName?.toLowerCase().includes(filters.q.toLowerCase()) ||
        String(r.roomNumber).toLowerCase().includes(filters.q.toLowerCase())
      );
      const mS = !filters.status || r.paymentStatus === filters.status;
      // server already filters by dates if provided
      return mQ && mS;
    });
  }, [rows, filters]);

  const openModal = (mode, data = null) => setModal({ show: true, mode, data });
  const closeModal = () => { setModal({ show: false, mode: null, data: null }); setInvoice(null); };

  const handleAction = (actionId, rowData) => {
    switch (actionId) {
      case 'payment':
        openModal('payment', rowData);
        break;
      case 'refund':
        openModal('refund', rowData);
        break;
      case 'invoice':
        loadInvoice(rowData.id);
        break;
      case 'mark-paid':
        updateStatus(rowData.id, 'Paid');
        break;
      case 'mark-pending':
        updateStatus(rowData.id, 'Pending');
        break;
      default:
        break;
    }
  };

  const loadInvoice = async (bookingId) => {
    try {
      const res = await fetch(`http://localhost:3001/api/billing/${bookingId}/invoice`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setInvoice(data);
      openModal('invoice', data);
    } catch (e) {
      toast.error('Failed to load invoice');
    }
  };

  const downloadInvoicePdf = async (bookingId) => {
    try {
      const res = await fetch(`http://localhost:3001/api/billing/${bookingId}/invoice.pdf`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to download');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${bookingId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      toast.error('Failed to download PDF');
    }
  };

  const addPayment = async ({ amount, method, note }) => {
    try {
      const res = await fetch(`http://localhost:3001/api/billing/${modal.data.id || modal.data.booking?._id}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: Number(amount), method, note })
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Payment added');
      closeModal();
      fetchBilling();
    } catch (e) {
      toast.error('Failed to add payment');
    }
  };

  const addRefund = async ({ amount, method, note }) => {
    try {
      const res = await fetch(`http://localhost:3001/api/billing/${modal.data.id || modal.data.booking?._id}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: Number(amount), method, note })
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Refund recorded');
      closeModal();
      fetchBilling();
    } catch (e) {
      toast.error('Failed to refund');
    }
  };

  const updateStatus = async (bookingId, status) => {
    try {
      const res = await fetch(`http://localhost:3001/api/billing/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ paymentStatus:status })
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Status updated');
      fetchBilling();
    } catch (e) {
      toast.error('Failed to update');
    }
  };

  const exportCSV = () => {
    const header = ['Booking ID', 'Guest Name', 'Room No.', 'Check-in', 'Check-out', 'Total Amount', 'Amount Paid', 'Remaining', 'Payment Status'];
    const lines = filteredRows.map(r => [r.bookingNumber, r.guestName, r.roomNumber, new Date(r.checkInDate).toLocaleDateString(), new Date(r.checkOutDate).toLocaleDateString(), r.totalAmount, r.amountPaid, r.remainingBalance, r.paymentStatus].join(','));
    const csv = [header.join(','), ...lines].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'billing.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Paid': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
      'Pending': { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
      'Partial': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' }
    };
    const config = statusConfig[status] || statusConfig.Pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
        {status}
      </span>
    );
  };

  const paymentFields = [
    { name: 'amount', label: 'Amount (Rs)', type: 'number', required: true },
    { name: 'method', label: 'Method', type: 'select', required: true, options: ['Cash', 'Card', 'UPI', 'Online'] },
    { name: 'note', label: 'Note', type: 'text', required: false }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <FileText className="h-7 w-7 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Billing Management</h1>
                <p className="text-sm text-gray-600">Booking-wise billing, invoices, payments and status control</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={exportCSV}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 transition-colors"
              >
                <Download size={16} />
                Export CSV
              </button>
              <button
                onClick={fetchBilling}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 transition-colors"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="col-span-1 lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Booking ID, guest, room..."
                  value={filters.q}
                  onChange={(e) => setFilters(p => ({ ...p, q: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={filters.status}
                onChange={(e) => setFilters(p => ({ ...p, status: e.target.value }))}
              >
                <option value="">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Partial">Partial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={filters.from}
                onChange={(e) => setFilters(p => ({ ...p, from: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={filters.to}
                onChange={(e) => setFilters(p => ({ ...p, to: e.target.value }))}
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={fetchBilling}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Apply
              </button>
              <button
                onClick={clearFilters}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible">
          {loading ? (
            <div className="flex items-center justify-center h-56">
              <div className="flex items-center gap-3">
                <RefreshCw className="h-5 w-5 animate-spin text-indigo-600" />
                <span className="text-gray-600">Loading billing records...</span>
              </div>
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-56 text-gray-500">
              <FileText className="h-12 w-12 mb-3 text-gray-300" />
              <p className="text-lg font-medium">No billing records found</p>
              <p className="text-sm">Try adjusting your filters or check back later</p>
            </div>
          ) : (
            <div className="overflow-x-auto ">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guest & Room
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stay Period
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Financial Summary
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200  z-0">
                  {filteredRows.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors z-0">
                      {/* Booking Details */}
                      <td className="px-6 py-4 whitespace-nowrap  z-0">
                        <div className="flex flex-col  z-0">
                          <div className="text-sm font-mono font-semibold text-gray-900">
                            {r.bookingNumber}
                          </div>
                          <div className="text-xs text-gray-500">
                            Booking ID
                          </div>
                        </div>
                      </td>

                      {/* Guest & Room */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900">
                            {r.guestName}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <span>Room {r.roomNumber}</span>
                          </div>
                        </div>
                      </td>

                      {/* Stay Period */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(r.checkInDate).toLocaleDateString()}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            to {new Date(r.checkOutDate).toLocaleDateString()}
                          </div>
                        </div>
                      </td>

                      {/* Financial Summary */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col text-sm">
                          <div className="text-green-600 font-semibold">
                            Rs {r.totalAmount?.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            Paid: Rs {r.amountPaid?.toLocaleString()}
                          </div>
                          {r.remainingBalance > 0 && (
                            <div className="text-xs text-red-600">
                              Due: Rs {r.remainingBalance?.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(r.paymentStatus)}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <ActionsDropdown row={r} onAction={handleAction} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Payment / Refund Modal */}
        {modal.show && modal.mode === 'payment' && (
          <Modal
            title="Add Payment"
            subtitle="Record a payment for this booking"
            mode="add"
            data={{}}
            fields={paymentFields}
            onClose={closeModal}
            onSubmit={addPayment}
            loading={false}
            errors={{}}
          />
        )}
        {modal.show && modal.mode === 'refund' && (
          <Modal
            title="Add Refund"
            subtitle="Record a refund for this booking"
            mode="add"
            data={{}}
            fields={paymentFields}
            onClose={closeModal}
            onSubmit={addRefund}
            loading={false}
            errors={{}}
          />
        )}

        {/* Invoice Modal */}
        {modal.show && modal.mode === 'invoice' && invoice && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Invoice Details</h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XCircle size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Guest & Booking Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Guest Name</label>
                        <p className="text-lg font-semibold text-gray-900">{invoice.booking.guest?.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Room Details</label>
                        <p className="text-lg font-semibold text-gray-900">
                          Room {invoice.booking.room?.roomNumber} • {invoice.booking.room?.roomType}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Check-in Date</label>
                        <p className="text-lg font-semibold text-gray-900">
                          {new Date(invoice.booking.checkInDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Check-out Date</label>
                        <p className="text-lg font-semibold text-gray-900">
                          {new Date(invoice.booking.checkOutDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Charges Breakdown */}
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Charges Breakdown</h4>
                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                      <div className="grid grid-cols-4 gap-4 px-4 py-3 bg-gray-100 text-sm font-medium text-gray-700">
                        <div>Item</div>
                        <div>Days</div>
                        <div>Rate (Rs)</div>
                        <div className="text-right">Total (Rs)</div>
                      </div>

                      <div className="divide-y divide-gray-200">
                        {/* Room Charges */}
                        <div className="grid grid-cols-4 gap-4 px-4 py-3 text-sm">
                          <div className="font-medium">Room Charges</div>
                          <div>{invoice.totals.nights} nights</div>
                          <div>Rs {invoice.totals.roomPrice?.toLocaleString()}</div>
                          <div className="text-right font-semibold">Rs {invoice.totals.roomTotal?.toLocaleString()}</div>
                        </div>

                        {/* Additional Services */}
                        {(invoice.services || []).map((service, idx) => (
                          <div key={idx} className="grid grid-cols-4 gap-4 px-4 py-3 text-sm">
                            <div className="font-medium">{service.service}</div>
                            <div>{service.quantity || 1}</div>
                            <div>Rs {(service.price || 0).toLocaleString()}</div>
                            <div className="text-right font-semibold">
                              Rs {((service.price || 0) * (service.quantity || 1)).toLocaleString()}
                            </div>
                          </div>
                        ))}

                        {/* Total */}
                        <div className="grid grid-cols-4 gap-4 px-4 py-3 bg-gray-100 text-sm font-bold">
                          <div className="col-span-3 text-right">Grand Total:</div>
                          <div className="text-right text-green-600">
                            Rs {invoice.totals.total?.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center pt-6 border-t">
                    <button
                      onClick={() => downloadInvoicePdf(invoice.booking._id)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Download size={16} />
                      Download PDF
                    </button>
                    <button
                      onClick={closeModal}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingManagement;