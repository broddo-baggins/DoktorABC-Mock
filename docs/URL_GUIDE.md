# Complete URL Guide - DoktorABC Mobile Mock

## **Base URL:** http://localhost:3000

---

## 📱 **All Portal URLs & Access**

### **🏠 Public Pages** (No login required)

| Page | URL | Description |
|------|-----|-------------|
| **Landing Page** | `/` or http://localhost:3000 | Conversion-optimized Botox hero |
| **Login** | `/login` | **Quick portal access buttons included!** |
| **Register** | `/register` | New patient registration |
| **Browse Treatments** | `/categories` | All 40+ treatments with search & filter |
| **Treatment Details** | `/treatment/botox-forehead` | Example treatment page |
| **How It Works** | `/how-it-works` | 5-step process explanation |
| **About Us** | `/about` | Company info & values |
| **Shipping** | `/shipping` | Delivery options & clinic network |
| **FAQ** | `/faq` | Frequently asked questions |
| **Contact** | `/contact` | Contact form & information |

---

### **👤 Patient Portal** (Login: `sarah.johnson@email.com` / `demo123`)

| Page | URL | Purpose |
|------|-----|---------|
| **Dashboard** | `/dashboard` | Overview, appointments, prescriptions |
| **Shopping Cart** | `/cart` | Cart items & checkout |
| **Questionnaire** | `/questionnaire/botox-forehead` | Medical questionnaire (4 steps) |
| **Book Consultation** | `/book-consultation` | Doctor selection & scheduling |
| **Waiting Room** | `/consultation/waiting/appt-001` | Pre-consultation countdown |
| **Treatment Plan** | `/treatment-plan/appt-001` | Doctor's prescription & plan |
| **Book Treatment** | `/book-treatment/appt-001` | Clinic selection & scheduling |
| **Payment** | `/payment/appt-002` | Checkout & payment processing |
| **Treatment Day** | `/treatment-day/appt-002` | Check-in, photos, workflow |
| **Aftercare** | `/aftercare/botox-forehead` | Day-by-day care instructions |
| **Follow-Up** | `/follow-up/botox-forehead` | Schedule 2-week check-in |

**Entry Point:** http://localhost:3000/dashboard

---

### **👨‍⚕️ Doctor Portal** (Login: `dr.emily.watson@doktorabc.com` / `demo123`)

| Page | URL | Purpose |
|------|-----|---------|
| **Dashboard** | `/doctor/dashboard` | Pending reviews, schedule, stats |
| **Patient Review** | `/doctor/review/patient-001` | Review questionnaire & approve |
| **Video Consultation** | `/doctor/consultation/session-123` | Mock video call interface |
| **Prescriptions** | `/doctor/prescriptions` | Manage all prescriptions |
| **Treatment Monitoring** | `/doctor/treatments` | Track ongoing treatments |
| **Availability** | `/doctor/availability` | Set weekly schedule |

**Entry Point:** http://localhost:3000/doctor/dashboard

---

### **💊 Pharmacy Portal** (Login: `central.pharmacy@partner.com` / `demo123`)

| Page | URL | Purpose |
|------|-----|---------|
| **Dashboard** | `/pharmacy/dashboard` | Orders, stock alerts, stats |
| **Order Management** | `/pharmacy/orders` | Process prescription orders |
| **Inventory** | `/pharmacy/inventory` | Stock levels, reorder alerts |
| **Delivery** | `/pharmacy/delivery` | Coordinate deliveries |

**Entry Point:** http://localhost:3000/pharmacy/dashboard

---

### **🔧 Support Engineer Portal** (Login: `tech.support@doktorabc.com` / `demo123`)

| Page | URL | Purpose |
|------|-----|---------|
| **Dashboard** | `/support/dashboard` | Ticket overview & metrics |
| **Ticket Management** | `/support/tickets` | Handle technical issues |
| **System Monitoring** | `/support/monitoring` | Platform health & uptime |

**Entry Point:** http://localhost:3000/support/dashboard

---

### **💬 Customer Service Portal** (Login: `cs.lead@doktorabc.com` / `demo123`)

| Page | URL | Purpose |
|------|-----|---------|
| **Dashboard** | `/customer-service/dashboard` | Inquiry overview & stats |
| **Inquiry Management** | `/customer-service/inquiries` | Handle customer messages |

**Entry Point:** http://localhost:3000/customer-service/dashboard

---

## **Quick Access from Login Page**

**NEW FEATURE:** Login page (`/login`) now includes **Quick Portal Access** buttons!

Click any button to auto-login and go directly to that portal:
- 👤 **Patient Portal** - Instant login as Sarah Johnson
- 👨‍⚕️ **Doctor Portal** - Instant login as Dr. Emily Watson
- 💊 **Pharmacy Portal** - Instant login as Central Pharmacy
- 🔧 **Support Portal** - Instant login as Support Engineer
- 💬 **Customer Service Portal** - Instant login as CS Lead

**No manual login required!** Perfect for demos.

---

## 📱 **Mobile Support - 100% Responsive**

### **Mobile Optimization Features**

**Mobile-First Design**
- All pages optimized for 375x812 (iPhone X)
- Touch-friendly buttons (min 44x44px tap targets)
- Responsive grid layouts (collapse to single column)
- Optimized typography for small screens

**Mobile Navigation**
- Hamburger menu on mobile
- Full-width CTAs
- Sticky elements positioned correctly
- Easy thumb navigation

**Mobile-Specific Features**
- **Sticky booking bar** (fixed to bottom on scroll)
- Swipe-friendly carousels
- Auto-focus on form fields
- Optimized form layouts

**Breakpoints**
- **Mobile:** < 768px (full optimization)
- **Tablet:** 768px - 1024px (hybrid layout)
- **Desktop:** > 1024px (multi-column)

**Tested On**
- iPhone sizes (X, 12, 13, 14, 15)
- Android sizes (standard, large)
- iPad (portrait & landscape)
- Desktop (all sizes)

---

## 🎥 **Demo Recording - Mobile Setup**

### **Browser Setup for Mobile Demo**

**Chrome/Edge:**
1. Press `F12` or `Cmd+Opt+I` (Mac)
2. Click "Toggle Device Toolbar" icon
3. Select "iPhone X" or custom 375x812
4. Rotate to portrait

**Firefox:**
1. Press `Cmd+Opt+M` (Mac) or `Ctrl+Shift+M` (Windows)
2. Choose responsive mode
3. Set to 375x812

**Safari:**
1. Enable Develop menu (Preferences → Advanced)
2. Develop → Enter Responsive Design Mode
3. Choose iPhone model

---

## 🔗 **Complete URL List for Copy/Paste**

### **Quick Test URLs:**

```
# Landing & Auth
http://localhost:3000/
http://localhost:3000/login
http://localhost:3000/register

# Browse & Info
http://localhost:3000/categories
http://localhost:3000/treatment/botox-forehead
http://localhost:3000/how-it-works
http://localhost:3000/about
http://localhost:3000/shipping
http://localhost:3000/faq
http://localhost:3000/contact

# Patient Portal (login as sarah.johnson@email.com)
http://localhost:3000/dashboard
http://localhost:3000/cart
http://localhost:3000/questionnaire/botox-forehead
http://localhost:3000/book-consultation
http://localhost:3000/consultation/waiting/appt-001
http://localhost:3000/treatment-plan/appt-001
http://localhost:3000/book-treatment/appt-001
http://localhost:3000/payment/appt-002
http://localhost:3000/treatment-day/appt-002
http://localhost:3000/aftercare/botox-forehead
http://localhost:3000/follow-up/botox-forehead

# Doctor Portal (login as dr.emily.watson@doktorabc.com)
http://localhost:3000/doctor/dashboard
http://localhost:3000/doctor/review/patient-001
http://localhost:3000/doctor/consultation/session-123
http://localhost:3000/doctor/prescriptions
http://localhost:3000/doctor/treatments
http://localhost:3000/doctor/availability

# Pharmacy Portal (login as central.pharmacy@partner.com)
http://localhost:3000/pharmacy/dashboard
http://localhost:3000/pharmacy/orders
http://localhost:3000/pharmacy/inventory
http://localhost:3000/pharmacy/delivery

# Support Portal (login as tech.support@doktorabc.com)
http://localhost:3000/support/dashboard
http://localhost:3000/support/tickets
http://localhost:3000/support/monitoring

# Customer Service Portal (login as cs.lead@doktorabc.com)
http://localhost:3000/customer-service/dashboard
http://localhost:3000/customer-service/inquiries
```

---

## **Portal Access Summary**

### **How to Reach Each Portal:**

**Method 1: Quick Portal Buttons (Easiest)**
1. Go to http://localhost:3000/login
2. Click any "Quick Portal Access" button
3. Automatically logged in and redirected!

**Method 2: Demo Account Dropdown**
1. Go to http://localhost:3000/login
2. Use "Quick Login As" dropdown
3. Select account → Click "Sign In"

**Method 3: Manual Login**
1. Go to http://localhost:3000/login
2. Enter email and password
3. Click "Sign In"

**Method 4: Direct URL** (Must be logged in)
- Navigate directly to dashboard URL
- Will redirect to login if not authenticated

---

## 📱 **Mobile Support Checklist**

### **All Portals Mobile-Optimized:**

**Patient Portal:**
- [x] All 11 pages responsive
- [x] Forms optimized for mobile input
- [x] Calendar widget touch-friendly
- [x] Payment flow mobile-ready
- [x] Photo upload mobile-compatible

**Doctor Portal:**
- [x] All 6 pages responsive
- [x] Patient list scrollable
- [x] Video interface adapts to screen
- [x] Forms mobile-friendly

**Pharmacy Portal:**
- [x] All 4 pages responsive
- [x] Order list touch-optimized
- [x] Inventory table scrollable
- [x] Actions easily tappable

**Support Portal:**
- [x] All 3 pages responsive
- [x] Ticket list mobile-optimized
- [x] Monitoring dashboard readable

**Customer Service Portal:**
- [x] All 2 pages responsive
- [x] Messaging interface mobile-friendly
- [x] Inquiry list scrollable

---

## ✨ **Mobile Features**

1. **Sticky Elements:**
   - Header stays at top
   - Booking bar appears on scroll
   - CTAs always visible

2. **Touch Optimizations:**
   - Large tap targets (44x44px minimum)
   - Swipeable where appropriate
   - No hover-dependent functionality

3. **Performance:**
   - Fast loading
   - Smooth animations
   - Optimized images

4. **Forms:**
   - Mobile keyboard types
   - Auto-focus
   - Validation feedback
   - Easy submission

---

## 🎬 **Demo Recording URLs**

**Start here:** http://localhost:3000  
**Portal access:** http://localhost:3000/login (use quick buttons)  

**Test each portal:**
1. Patient: http://localhost:3000/dashboard
2. Doctor: http://localhost:3000/doctor/dashboard
3. Pharmacy: http://localhost:3000/pharmacy/dashboard
4. Support: http://localhost:3000/support/dashboard
5. CS: http://localhost:3000/customer-service/dashboard

---

## 📧 **Quick Reference**

**All Passwords:** `demo123`

**Patient:** sarah.johnson@email.com  
**Doctor:** dr.emily.watson@doktorabc.com  
**Pharmacy:** central.pharmacy@partner.com  
**Support:** tech.support@doktorabc.com  
**CS:** cs.lead@doktorabc.com  

---

**Status:** **All portals accessible • Mobile-optimized • Quick access available!**

