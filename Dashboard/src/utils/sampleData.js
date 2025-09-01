// Sample data for the hotel management system
export const initializeSampleData = () => {
  // Check if data already exists
  if (localStorage.getItem('sampleDataInitialized')) {
    return;
  }

  // Sample staff data
  const sampleStaff = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@luxurystay.com',
      phone: '+1 (555) 123-4567',
      role: 'Manager',
      status: 'Active',
      createdAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@luxurystay.com',
      phone: '+1 (555) 234-5678',
      role: 'Receptionist',
      status: 'Active',
      createdAt: '2024-01-05T00:00:00.000Z'
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      email: 'emma.rodriguez@luxurystay.com',
      phone: '+1 (555) 345-6789',
      role: 'Housekeeping',
      status: 'Active',
      createdAt: '2024-01-10T00:00:00.000Z'
    },
    {
      id: 4,
      name: 'David Kim',
      email: 'david.kim@luxurystay.com',
      phone: '+1 (555) 456-7890',
      role: 'Maintenance',
      status: 'Active',
      createdAt: '2024-01-15T00:00:00.000Z'
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      email: 'lisa.thompson@luxurystay.com',
      phone: '+1 (555) 567-8901',
      role: 'Security',
      status: 'Active',
      createdAt: '2024-01-20T00:00:00.000Z'
    }
  ];

  // Sample reservations data
  const sampleReservations = [
    {
      id: 1,
      guestName: 'John Smith',
      roomNumber: '201',
      checkIn: '2024-01-15',
      checkOut: '2024-01-20',
      amount: 1250,
      status: 'confirmed',
      createdAt: '2024-01-10T00:00:00.000Z'
    },
    {
      id: 2,
      guestName: 'Maria Garcia',
      roomNumber: '305',
      checkIn: '2024-01-16',
      checkOut: '2024-01-19',
      amount: 890,
      status: 'confirmed',
      createdAt: '2024-01-11T00:00:00.000Z'
    },
    {
      id: 3,
      guestName: 'Robert Wilson',
      roomNumber: '102',
      checkIn: '2024-01-17',
      checkOut: '2024-01-22',
      amount: 1680,
      status: 'pending',
      createdAt: '2024-01-12T00:00:00.000Z'
    },
    {
      id: 4,
      guestName: 'Jennifer Lee',
      roomNumber: '408',
      checkIn: '2024-01-18',
      checkOut: '2024-01-21',
      amount: 1120,
      status: 'confirmed',
      createdAt: '2024-01-13T00:00:00.000Z'
    },
    {
      id: 5,
      guestName: 'Thomas Brown',
      roomNumber: '203',
      checkIn: '2024-01-19',
      checkOut: '2024-01-25',
      amount: 2100,
      status: 'cancelled',
      createdAt: '2024-01-14T00:00:00.000Z'
    }
  ];

  // Store sample data
  localStorage.setItem('users', JSON.stringify(sampleStaff));
  localStorage.setItem('reservations', JSON.stringify(sampleReservations));
  localStorage.setItem('sampleDataInitialized', 'true');
};

// Function to clear sample data
export const clearSampleData = () => {
  localStorage.removeItem('users');
  localStorage.removeItem('reservations');
  localStorage.removeItem('sampleDataInitialized');
};

// Function to reset to sample data
export const resetToSampleData = () => {
  clearSampleData();
  initializeSampleData();
};
