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

## 🧪 Testing Suite

### Test Categories

The application includes a comprehensive test suite covering multiple testing methodologies:

#### 1. **Smoke Tests** 🔥
- **Purpose**: Quick verification that critical functionality works after deployment
- **When to Run**: After every deployment, before detailed testing begins
- **Coverage**: Essential features required for basic operation
- **Runtime**: ~5 seconds

**What's Tested:**
- Application entry points exist (main.jsx, App.jsx)
- Critical pages load (Landing, Login, Categories)
- Core routes are defined (/, /login, /categories)
- Essential components exist (Header, Footer)
- Authentication context is configured
- Required data files exist and are valid JSON

**User Stories Covered:**
- US-001: As a visitor, I want to access the landing page
- US-002: As a visitor, I want to view available treatments
- US-003: As a visitor, I want to access login/register
- US-004: As a user, I want basic navigation to work

**Run Command:**
```bash
npm run test:smoke
```

---

#### 2. **Sanity Tests** 🧪
- **Purpose**: Verify core functionality after bug fixes or minor changes
- **When to Run**: After bug fixes, minor updates, or configuration changes
- **Coverage**: Key features and critical workflows
- **Runtime**: ~10 seconds

**What's Tested:**
- All public routes are accessible without authentication
- Protected routes require authentication and check roles
- Navigation links in Header and Footer work correctly
- Authentication system (login/logout) functions properly
- Data management (treatments, users) works as expected
- Key pages import and render components

**User Stories Covered:**
- US-010: As a visitor, I want to browse all treatment categories
- US-011: As a visitor, I want to read treatment details
- US-020: As a patient, I want to access my dashboard
- US-021: As a patient, I want to view my cart
- US-030: As a doctor, I want to access my portal
- US-040: As a pharmacist, I want to manage orders

**Run Command:**
```bash
npm run test:sanity
```

---

#### 3. **Regression Tests** 🔄
- **Purpose**: Ensure existing features still work after code changes
- **When to Run**: Before releases, after major feature additions
- **Coverage**: All previously working features
- **Runtime**: ~15 seconds

**What's Tested:**
- All 41 routes still exist and are configured correctly
- Navigation links in Header, Footer, and Landing page remain intact
- Authentication features (login, logout, role-based access) work
- All critical pages exist and haven't been deleted
- Data structures remain consistent across changes
- UI components are still present
- Context providers maintain required functionality

**User Stories Covered:**
- US-001 to US-050: All implemented user stories
- Validates backward compatibility
- Prevents feature regression

**Run Command:**
```bash
npm run test:regression
```

---

#### 4. **Positive Tests** ✅
- **Purpose**: Verify expected behavior with valid inputs (happy path)
- **When to Run**: During development, before releases
- **Coverage**: Normal use cases with valid data
- **Runtime**: ~12 seconds

**What's Tested:**
- Valid routes are accessible
- Public pages work without authentication
- Treatment browsing and detail viewing works
- Valid user credentials authenticate successfully
- Login redirects to appropriate dashboards by role
- Data structures are valid and contain required fields
- Role-based access allows correct roles
- UI components export and function properly

**User Stories Covered:**
- US-101: As a visitor, I can navigate to all public pages
- US-102: As a patient, I can log in with valid credentials
- US-103: As a patient, I can browse treatments
- US-104: As a patient, I can add items to cart
- US-105: As a doctor, I can access my dashboard
- US-106: As staff, I can access role-specific pages

**Run Command:**
```bash
npm run test:positive
```

---

#### 5. **Negative Tests** ❌
- **Purpose**: Verify error handling with invalid inputs and security
- **When to Run**: During development, security audits
- **Coverage**: Error cases, edge cases, unauthorized access
- **Runtime**: ~10 seconds

**What's Tested:**
- Protected routes reject unauthorized access
- Role-based access prevents wrong role access (doctor routes reject patients)
- Invalid routes redirect to 404/home
- Missing data is handled gracefully (empty arrays, null users)
- Input validation exists on forms
- Security measures: passwords not in plain text, auth state persists, logout clears state
- User roles cannot be modified by client
- Error boundaries or error handling exists

**User Stories Covered:**
- US-201: As a system, I prevent unauthorized access
- US-202: As a system, I handle invalid routes gracefully
- US-203: As a system, I validate user inputs
- US-204: As a system, I prevent role escalation
- US-205: As a system, I handle missing data

**Run Command:**
```bash
npm run test:negative
```

---

### Running Tests

#### Run All Tests
Executes all test suites in sequence (Smoke → Sanity → Positive → Negative → Regression):
```bash
npm test
```

or

```bash
npm run test
```

#### Run Individual Test Suites
```bash
npm run test:smoke       # Smoke tests only (~5s)
npm run test:sanity      # Sanity tests only (~10s)
npm run test:positive    # Positive tests only (~12s)
npm run test:negative    # Negative tests only (~10s)
npm run test:regression  # Regression tests only (~15s)
```

### Test Output Example

```
🔥 SMOKE TESTS - Critical Functionality Check
═══════════════════════════════════════════════════════════

✅ PASS: ST-001: App entry point exists (main.jsx)
✅ PASS: ST-002: App component exists (App.jsx)
✅ PASS: ST-003: Landing page exists (LandingNew.jsx)
✅ PASS: ST-004: Root route (/) is defined
✅ PASS: ST-005: Login route (/login) is defined
...

═══════════════════════════════════════════════════════════
📊 SMOKE TEST RESULTS:
   Total: 11
   ✅ Passed: 11
   ❌ Failed: 0
   Success Rate: 100.0%

✅ SMOKE TESTS PASSED - Critical functionality verified!
```

### Test Coverage Summary

| Test Suite | # Tests | Purpose | Critical | Runtime |
|------------|---------|---------|----------|---------|
| Smoke | 11 | Application starts and core files exist | Yes | ~5s |
| Sanity | 16 | Core features work correctly | Yes | ~10s |
| Regression | 50+ | No features broken by changes | No | ~15s |
| Positive | 21 | Valid inputs produce expected results | No | ~12s |
| Negative | 20 | Invalid inputs handled gracefully | No | ~10s |
| **Total** | **~118** | **Full application validation** | - | **~52s** |

### Testing Best Practices

1. **Before Committing**: Run `npm test` to ensure no regressions
2. **After Deployment**: Run `npm run test:smoke` to verify deployment
3. **After Bug Fixes**: Run `npm run test:sanity` to verify the fix
4. **Before Releases**: Run full test suite `npm test`
5. **Security Audits**: Run `npm run test:negative` specifically

### CI/CD Integration

Add to your CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
- name: Run Tests
  run: |
    npm install
    npm test
```

### Test Reports

All tests output to console with:
- ✅ Pass/❌ Fail indicators
- Detailed error messages when tests fail
- Summary statistics
- Success rates
- Exit codes (0 = pass, 1 = fail) for CI/CD

### Future Test Enhancements

Planned improvements:
- [ ] Integration tests with real HTTP requests
- [ ] E2E tests with Playwright/Cypress
- [ ] Visual regression testing
- [ ] Performance testing
- [ ] Accessibility testing (WCAG compliance)
- [ ] Code coverage reporting

---

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

