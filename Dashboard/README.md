# 🏨 LuxuryStay Hotel Management System

A comprehensive, professional hotel management admin dashboard built with React, Tailwind CSS, and DaisyUI. This system provides a complete solution for hotel administrators to manage staff, rooms, reservations, and business operations.

## ✨ Features

### 🔐 Authentication System
- **Secure Login/Signup** for admin users
- **Protected Routes** - Only authenticated users can access the dashboard
- **Session Management** with localStorage persistence
- **Demo Credentials**: `admin@luxurystay.com` / `admin123`

### 🎯 Admin Dashboard
- **Real-time Statistics** - Total staff, active staff, reservations, revenue
- **Interactive Charts** - Revenue trends, booking patterns, status distribution
- **Recent Activities** - Live feed of system activities
- **Quick Actions** - Fast access to common tasks

### 👥 Staff Management
- **Add/Edit/Delete** staff members
- **Role Management** - Manager, Receptionist, Housekeeping, Maintenance, Security
- **Status Control** - Activate/Deactivate staff accounts
- **Advanced Filtering** - Search by name, email, role, and status
- **Responsive Table** with sorting and pagination

### 🏠 Room Management (Coming Soon)
- Room inventory management
- Room type configuration
- Availability tracking
- Maintenance scheduling

### 📅 Reservations (Coming Soon)
- Guest booking management
- Check-in/Check-out process
- Reservation calendar view
- Guest information tracking

### 💳 Billing & Payments (Coming Soon)
- Invoice generation
- Payment processing
- Financial reporting
- Tax calculations

### 📊 Reports & Analytics (Coming Soon)
- Occupancy reports
- Revenue analytics
- Guest satisfaction metrics
- Staff performance reports

### ⚙️ System Settings (Coming Soon)
- Hotel information setup
- User account management
- System preferences
- Security configurations

## 🚀 Technology Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **UI Components**: DaisyUI
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: React Hooks
- **Data Storage**: LocalStorage (Mock Backend)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd luxury-style-guest-panel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔑 Quick Start

1. **Access the System**
   - Open the application in your browser
   - You'll see the login page

2. **Login as Admin**
   - Use demo credentials: `admin@luxurystay.com` / `admin123`
   - Or create a new account using the signup feature

3. **Explore the Dashboard**
   - View real-time statistics and charts
   - Navigate between different modules using the sidebar

4. **Manage Staff**
   - Go to "Staff Management" from the sidebar
   - Add new staff members
   - Edit existing staff information
   - Activate/deactivate staff accounts

## 🎨 UI/UX Features

- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Modern Interface** - Clean, professional design with smooth animations
- **Dark/Light Mode Ready** - DaisyUI theme system integration
- **Accessibility** - Proper ARIA labels and keyboard navigation
- **Loading States** - Smooth loading animations and feedback
- **Error Handling** - User-friendly error messages and validation

## 📱 Responsive Design

- **Mobile First** approach
- **Collapsible Sidebar** for mobile devices
- **Touch-friendly** interface elements
- **Adaptive Layouts** for different screen sizes
- **Optimized Tables** with horizontal scrolling on small screens

## 🔧 Customization

### Adding New Modules
1. Create a new component in `src/components/`
2. Add the module to the navigation in `DashboardLayout.jsx`
3. Update the routing logic in `App.jsx`
4. Add any required icons and styling

### Modifying Styles
- **Tailwind Classes**: Use Tailwind utility classes for styling
- **DaisyUI Components**: Leverage DaisyUI's component library
- **Custom CSS**: Add custom styles in `src/index.css`

### Data Management
- **LocalStorage**: Currently uses localStorage for data persistence
- **API Integration**: Easy to replace with real API calls
- **Sample Data**: Includes realistic sample data for demonstration

## 📊 Sample Data

The system comes with pre-loaded sample data including:
- **5 Staff Members** with different roles
- **5 Sample Reservations** with various statuses
- **Realistic Revenue Data** for charts and analytics

## 🚧 Development Roadmap

### Phase 1 ✅ (Completed)
- [x] Authentication system
- [x] Dashboard layout and navigation
- [x] Staff management module
- [x] Basic statistics and charts

### Phase 2 🔄 (In Progress)
- [ ] Room management system
- [ ] Reservation management
- [ ] Enhanced reporting

### Phase 3 📋 (Planned)
- [ ] Billing and payment system
- [ ] Advanced analytics
- [ ] User management
- [ ] API integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the existing issues in the repository
2. Create a new issue with detailed information
3. Contact the development team

## 🙏 Acknowledgments

- **Tailwind CSS** for the utility-first CSS framework
- **DaisyUI** for the beautiful component library
- **Lucide React** for the elegant icons
- **Recharts** for the charting capabilities
- **React Team** for the amazing framework

---

**Built with ❤️ for the hospitality industry**
