# Project Overview

## What Was Built

A comprehensive multi-portal healthcare platform mock for DoktorABC, simulating the complete patient-to-treatment journey and professional healthcare portals. Built as a training demo and portfolio piece.

---

## Key Features

### 5 Complete Portal Experiences

1. **Patient Portal** - End-to-end treatment booking flow
2. **Doctor Portal** - Patient review and prescription management
3. **Pharmacy Portal** - Order processing and inventory management
4. **Support Portal** - Technical ticket management and monitoring
5. **Customer Service Portal** - Customer inquiry handling

### Complete Patient Journey

- Browse treatments and view details
- Complete medical questionnaire (4-step wizard)
- Book doctor consultation
- Receive treatment plan approval
- Schedule treatment at partner clinic
- Process payment
- Treatment day workflow with photo documentation
- Follow personalized aftercare instructions
- Schedule follow-up appointments

---

## Technical Stack

**Frontend Framework:** React 18.3.1  
**Build Tool:** Vite 5.1.0  
**Routing:** React Router v6  
**Styling:** Tailwind CSS 3.4.1  
**State Management:** React Context API  
**Animations:** Framer Motion  
**Icons:** Lucide React  
**Data Storage:** LocalStorage (mock backend)

---

## Project Structure

```
DoktorABC-Mock/
├── src/
│   ├── components/
│   │   ├── Layout/           # Header, Footer
│   │   └── ui/               # Reusable UI components
│   ├── contexts/             # Auth and AppState contexts
│   ├── data/                 # Mock JSON data (6 files)
│   ├── pages/
│   │   ├── Patient/          # 11 patient-facing pages
│   │   ├── Doctor/           # 6 doctor portal pages
│   │   ├── Pharmacy/         # 4 pharmacy portal pages
│   │   ├── Support/          # 3 support portal pages
│   │   └── CustomerService/  # 2 CS portal pages
│   ├── utils/                # Helper functions
│   ├── App.jsx               # Main routing configuration
│   └── main.jsx              # Application entry point
├── public/                   # Static assets
├── tests/                    # Automated test suite
├── docs/                     # Documentation
└── package.json              # Dependencies and scripts
```

---

## Pages & Routes

### Patient Portal (11 pages)
- Dashboard (`/dashboard`)
- Browse Treatments (`/categories`)
- Treatment Details (`/treatment/:id`)
- Medical Questionnaire (`/questionnaire/:id`)
- Book Consultation (`/book-consultation`)
- Consultation Waiting Room (`/consultation/waiting/:id`)
- Treatment Plan Review (`/treatment-plan/:id`)
- Book Treatment Appointment (`/book-treatment/:id`)
- Payment Processing (`/payment/:id`)
- Treatment Day (`/treatment-day/:id`)
- Aftercare Guide (`/aftercare/:id`)
- Follow-Up Scheduling (`/follow-up/:id`)

### Doctor Portal (6 pages)
- Dashboard with patient queue
- Patient medical review
- Video consultation interface
- Prescription management
- Treatment monitoring
- Availability scheduling

### Pharmacy Portal (4 pages)
- Dashboard with order overview
- Order management
- Inventory tracking
- Delivery coordination

### Support Portal (3 pages)
- Dashboard with ticket overview
- Ticket management
- System monitoring

### Customer Service Portal (2 pages)
- Dashboard with inquiry overview
- Inquiry management

### Public Pages (7 pages)
- Landing page
- Login/Register
- How It Works
- About
- Contact
- Terms & Privacy

---

## Mock Data

### Included Files
- `treatments.json` - 10 treatments across 6 categories
- `users.json` - 8 pre-configured test accounts (all roles)
- `appointments.json` - Sample appointments at various stages
- `prescriptions.json` - Active prescriptions
- `inventory.json` - Pharmacy stock levels
- `tickets.json` - Support and CS tickets

### Treatment Categories
- Aesthetic (Botox, fillers)
- Men's Health (ED, hair loss)
- Women's Health (contraception)
- Chronic conditions (blood pressure)
- Wellbeing (smoking cessation)
- Travel Health (malaria prevention)

---

## Testing Suite

Comprehensive automated test suite with 118+ tests across 5 categories:

- **Smoke Tests** - Critical functionality verification
- **Sanity Tests** - Core feature validation
- **Positive Tests** - Happy path scenarios
- **Negative Tests** - Error handling & security
- **Regression Tests** - Feature stability checks

See [`tests/README.md`](../tests/README.md) for details.

---

## Key Implementation Details

### Authentication
- Role-based access control
- Protected routes with automatic redirects
- Session persistence via LocalStorage
- Demo accounts for all portal types

### State Management
- `AuthContext` for user authentication
- `AppStateContext` for application data
- LocalStorage for data persistence
- No external API dependencies

### UI/UX Features
- Mobile-first responsive design
- Smooth page transitions
- Loading states and error handling
- Form validation
- Progress indicators for multi-step flows
- Toast notifications
- Modal dialogs

### Routing
- Client-side routing with React Router v6
- Protected routes by role
- Dynamic route parameters
- 404 error handling
- GitHub Pages SPA redirect support

### Performance
- Code splitting with manual chunks
- Optimized bundle sizes (<500KB main bundle)
- Lazy loading for better initial load
- Efficient re-renders with React hooks

---

## Deployment

**Live URLs:**
- GitHub Pages: https://broddo-baggins.github.io/DoktorABC-Mock/
- Vercel: https://doktorabc-mock.vercel.app

**CI/CD:**
- Automated deployments on push to `master`
- GitHub Actions for GitHub Pages
- Vercel integration for alternative hosting

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for deployment details.

---

## How to Use This Demo

1. Visit the live demo URL
2. Use demo credentials from [`DEMO_CREDENTIALS.md`](./DEMO_CREDENTIALS.md)
3. Explore any of the 5 portal experiences
4. All data persists in browser LocalStorage
5. No server or database required

---

## Development

```bash
# Clone repository
git clone https://github.com/broddo-baggins/DoktorABC-Mock.git
cd DoktorABC-Mock

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

---

## What Makes This Unique

- **Multi-persona platform** with 5 distinct portal experiences
- **Complete patient journey** from discovery to aftercare
- **Interconnected workflows** showing data flow between roles
- **Production-quality UI** with professional design and animations
- **Comprehensive testing** with 118+ automated tests
- **Dual deployment** on GitHub Pages and Vercel
- **Zero backend** - entirely frontend with mock data
- **Portfolio-ready** - fully documented and deployable

---

**Version:** v1.5-EA  
**Repository:** https://github.com/broddo-baggins/DoktorABC-Mock  
**Live Demo:** https://broddo-baggins.github.io/DoktorABC-Mock/

