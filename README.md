# DoktorABC Mobile Mock - Training Demo

A comprehensive React-based mobile-first mock application simulating the complete DoktorABC platform treatment funnel across multiple personas (patients, doctors, pharmacies, support engineers, and customer service).

## 🌐 Live Demo

**👉 [View Live Application](https://broddo-baggins.github.io/DoktorABC-Mock/)**

The application is deployed and live on GitHub Pages. No installation required - just click the link above to explore the demo!

> 📚 **Documentation:** All project documentation is organized in the [`docs/`](./docs/) folder. See [`docs/LANDING_PAGE_GUIDE.md`](./docs/LANDING_PAGE_GUIDE.md) for the complete landing page guide and [`docs/DEMO_CREDENTIALS.md`](./docs/DEMO_CREDENTIALS.md) for all login credentials.

## 🎯 Purpose

This is a **demo mock application for training purposes**. It demonstrates the complete user flow and workflows for:
- **Patients**: Browse treatments → Complete questionnaire → Book consultation → Get treatment → Follow-up care
- **Doctors**: Review patients → Conduct consultations → Prescribe treatments → Monitor progress
- **Pharmacies**: Manage orders → Track inventory → Coordinate deliveries
- **Support Engineers**: Handle technical issues → Monitor systems
- **Customer Service**: Manage inquiries → Handle complaints → Assist bookings

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn installed
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# The app will open at http://localhost:3000
```

### Build for Production

```bash
npm run build
npm run preview
```

## 👥 Demo Accounts

The application comes with pre-configured demo accounts for all personas:

### Patients
- **Email**: sarah.johnson@email.com | **Password**: demo123
- **Email**: john.smith@email.com | **Password**: demo123

### Doctors
- **Email**: dr.emily.watson@doktorabc.com | **Password**: demo123
- **Email**: dr.james.chen@doktorabc.com | **Password**: demo123

### Pharmacies
- **Email**: central.pharmacy@partner.com | **Password**: demo123
- **Email**: manchester.pharmacy@partner.com | **Password**: demo123

### Support Engineers
- **Email**: tech.support@doktorabc.com | **Password**: demo123

### Customer Service
- **Email**: cs.lead@doktorabc.com | **Password**: demo123

## 📱 Features

### Patient Portal
- Browse 10+ treatment categories with 2,500+ medications
- Complete comprehensive medical questionnaire
- Book video consultations with doctors
- Schedule treatment appointments at partner clinics
- Secure payment processing (mock)
- Treatment day check-in and photo documentation
- Post-treatment aftercare guides
- Follow-up consultation scheduling
- Prescription management
- Loyalty points and subscription system

### Doctor Portal
- Review patient medical questionnaires
- Conduct video consultations (mock interface)
- Approve/reject treatment requests
- Write and manage prescriptions
- Monitor ongoing treatments
- Set availability schedule
- View patient history and analytics

### Pharmacy Portal
- Manage prescription orders
- Track inventory levels with low-stock alerts
- Coordinate deliveries (2-hour express or 24-48h standard)
- Reorder stock automatically
- View analytics and reports

### Support Engineer Portal
- Handle technical support tickets
- Monitor system health
- Track platform performance
- Resolve integration issues
- View ticket history and metrics

### Customer Service Portal
- Manage customer inquiries
- Handle booking assistance
- Resolve complaints
- Message patients directly
- Track satisfaction scores

## 🛠 Technology Stack

- **Frontend**: React 18 with Hooks
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Data Persistence**: LocalStorage (mock)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📂 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Header, Footer
│   └── ui/             # Button, Card, Input, etc.
├── contexts/           # React Context providers
│   ├── AuthContext.jsx
│   └── AppStateContext.jsx
├── data/               # Mock JSON data
│   ├── treatments.json
│   ├── users.json
│   ├── appointments.json
│   ├── prescriptions.json
│   ├── inventory.json
│   └── tickets.json
├── pages/              # Page components
│   ├── Patient/       # Patient portal pages
│   ├── Doctor/        # Doctor portal pages
│   ├── Pharmacy/      # Pharmacy portal pages
│   ├── Support/       # Support portal pages
│   └── CustomerService/ # CS portal pages
├── utils/             # Utility functions
└── App.jsx            # Main app component
```

## 🎨 Design System

- **Colors**: Medical trust blues, accent greens, warm neutrals
- **Typography**: Inter font family
- **Spacing**: 8px grid system
- **Responsive**: Mobile-first approach with breakpoints
- **Components**: Consistent UI patterns across all portals

## 🔒 Security Note

This is a **mock/demo application** for training purposes:
- No real database connections
- No actual API calls
- No real payment processing
- All data stored in browser LocalStorage
- Mock authentication system
- **DO NOT** use for actual medical services

## 📊 Mock Data

The application includes:
- 10+ treatment options across multiple categories
- 8 pre-configured users (patients, doctors, pharmacies, support, CS)
- Sample appointments and prescriptions
- Mock inventory data
- Sample support tickets

All data persists in LocalStorage during the session and can be reset by clearing browser data.

## 🎥 Recording for Demo Video

### Recommended Flow for Video:

1. **Start at Landing Page**
   - Show hero section and features
   - Browse treatment categories
   - View treatment details

2. **Patient Journey**
   - Register/Login as patient
   - Complete questionnaire for Botox treatment
   - Book consultation with doctor
   - Show waiting room
   - View treatment plan
   - Book treatment at clinic
   - Complete payment
   - Treatment day workflow
   - Aftercare instructions
   - Schedule follow-up

3. **Doctor Portal**
   - Login as doctor
   - Review pending patient
   - Approve treatment
   - View dashboard analytics

4. **Pharmacy Portal**
   - Login as pharmacy
   - Process orders
   - Manage inventory
   - Coordinate delivery

5. **Support & CS**
   - Show support ticket system
   - Customer service inquiries

## 🚧 Limitations

This is a mock application with the following limitations:
- No actual backend server
- No real-time updates
- No email/SMS functionality
- No video calling (mock interface only)
- No payment processing
- No file uploads (simulated)
- Data resets on browser cache clear

## 📝 Development Notes

- All routes are protected based on user role
- LocalStorage used for session persistence
- Toast notifications for user feedback
- Responsive design optimized for mobile
- Loading states and error handling included

## 🤝 Support

For issues or questions about this demo application:
- This is a mock/training application
- No real medical services provided
- For demonstration purposes only

## 📄 License

This is a demo/training application. All rights reserved.

---

**Note**: This application simulates the DoktorABC platform for training purposes. It does not connect to any real databases, APIs, or medical services. All data is mock data stored locally in the browser.

