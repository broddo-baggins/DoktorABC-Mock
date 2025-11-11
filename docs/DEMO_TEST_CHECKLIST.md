# DEMO TEST CHECKLIST - DoktorABC Mock

## PRE-DEMO CHECKLIST

### **Site Access**
- [ ] Landing page loads: https://broddo-baggins.github.io/DoktorABC-Mock/
- [ ] No console errors in browser DevTools (F12)
- [ ] All fonts load correctly (Inter font family)

---

## 📋 **PUBLIC PAGES TEST**

### **Landing Page (Main Demo Start Point)**
- [ ] Hero section displays with "Book Your Botox Treatment in 3 Minutes"
- [ ] **Book Your Slot calendar** - Click different days (Wed-Sun should work, Mon-Tue disabled)
- [ ] **Time slots** - Click 09:00, 10:00, 11:30, 13:00, 14:30, 16:00, 17:30, 19:00
- [ ] **Confirm Booking button** updates with selected time
- [ ] Click "Confirm Booking" → navigates to categories
- [ ] Scroll down to see "Meet Your Practitioners" (3 doctors with photos)
- [ ] Logo click → stays on landing

### **Navigation Menu**
- [ ] How it works → loads page
- [ ] Medical Advisory Board (About) → loads page
- [ ] Shipping → loads page
- [ ] FAQ → loads page
- [ ] Customer Service (Contact) → loads page with form

### **Treatment Pages**
- [ ] Categories page → shows all treatment categories
- [ ] Click any treatment → goes to treatment detail page
- [ ] Treatment detail shows pricing, description, "Get Started" button

---

## 🔐 **AUTHENTICATION TEST**

### **Login Page**
- [ ] Click "Login" in header
- [ ] Form fields visible (email, password)
- [ ] **Demo Login Buttons** available for all roles:
  - [ ] Patient (Sarah Johnson)
  - [ ] Patient (John Smith)
  - [ ] Doctor (Dr. Emily Watson)
  - [ ] Doctor (Dr. James Chen)
  - [ ] Pharmacy
  - [ ] Support
  - [ ] Customer Service

### **Register Page**
- [ ] Click "Get Started" or "Register"
- [ ] Form fields visible and working
- [ ] Can type in all fields

---

## 👤 **PATIENT PORTAL TEST**

**Login as:** `sarah.johnson@email.com` / `demo123`

### **Patient Dashboard**
- [ ] Dashboard loads with welcome message
- [ ] **Stats cards** show:
  - [ ] Active Treatments
  - [ ] Upcoming Appointments
  - [ ] Prescriptions
  - [ ] Loyalty Points
- [ ] **Upcoming Appointments** section shows appointments
- [ ] **Active Prescriptions** section shows:
  - [ ] Botulinum Toxin Type A (Botox) - €350
  - [ ] Arnica Montana 30C - €12
  - [ ] Ibuprofen - €8
- [ ] **Quick Actions** buttons:
  - [ ] **New Consultation** → navigates to /categories
  - [ ] **Reorder Medication** → navigates to /categories
  - [ ] **Contact Support** → navigates to /contact

### **Patient Journey - Full Flow**
1. [ ] Dashboard → Click "New Consultation"
2. [ ] Categories → Select treatment (e.g., Botox)
3. [ ] Treatment Detail → Click "Get Started"
4. [ ] Questionnaire → Fill out medical history
5. [ ] Submit questionnaire
6. [ ] Book Consultation → Select doctor, date, time
7. [ ] Confirm booking
8. [ ] Consultation Waiting Room → Shows appointment details

### **Quick Book Flow**
- [ ] From treatment page → Click "Book Now"
- [ ] QuickBook page → Select area, clinic, time slot
- [ ] Creates account if not logged in
- [ ] €50 deposit screen
- [ ] Confirmation screen

---

## 👨‍⚕️ **DOCTOR PORTAL TEST**

**Login as:** `dr.emily.watson@doktorabc.com` / `demo123`

### **Doctor Dashboard**
- [ ] Dashboard loads with "Doctor Dashboard" heading
- [ ] **Header navigation** shows ONLY:
  - [ ] Support link (NOT patient links like "How it works")
  - [ ] No shopping cart
- [ ] **Stats cards** show:
  - [ ] Pending Reviews
  - [ ] Today's Consults
  - [ ] Prescriptions
  - [ ] Rating (4.8)
- [ ] **Pending Patient Reviews** section (may be empty)
- [ ] **Today's Schedule** section
- [ ] **Quick Actions** buttons work:
  - [ ] View Availability
  - [ ] Manage Prescriptions
  - [ ] Treatment Monitoring

### **Doctor Sub-Pages**
- [ ] Patient Review page loads
- [ ] Prescription Management page loads
- [ ] Treatment Monitoring page loads
- [ ] Availability Management page loads
- [ ] Video Consultation page loads

---

## 💊 **PHARMACY PORTAL TEST**

**Login as:** `central.pharmacy@partner.com` / `demo123`

### **Pharmacy Dashboard**
- [ ] Dashboard loads with "Pharmacy Dashboard"
- [ ] **Header shows ONLY Support** (no patient shopping links)
- [ ] Name shows "Berlin Mitte Pharmacy"
- [ ] Address shows "Alexanderplatz 1, Berlin"
- [ ] **Stats cards** show:
  - [ ] New Orders
  - [ ] Ready to Ship
  - [ ] Low Stock Alerts
  - [ ] Total Orders (15,420)
- [ ] **New Prescription Orders** section shows Botox prescriptions
- [ ] **Low Stock Items** section
- [ ] **Quick Actions** work

### **Pharmacy Sub-Pages**
- [ ] Order Management page loads
- [ ] Inventory Management page loads
- [ ] Delivery Coordination page loads

---

## 🛠️ **SUPPORT PORTAL TEST**

**Login as:** `tech.support@doktorabc.com` / `demo123`

### **Support Dashboard**
- [ ] Dashboard loads
- [ ] **Header shows ONLY Support** (no patient links)
- [ ] Ticket stats visible
- [ ] System Monitoring link works
- [ ] Ticket Management link works

---

## 👔 **CUSTOMER SERVICE PORTAL TEST**

**Login as:** `cs.lead@doktorabc.com` / `demo123`

### **CS Dashboard**
- [ ] Dashboard loads
- [ ] **Header shows ONLY Support** (no patient links)
- [ ] Inquiry stats visible
- [ ] Inquiry Management page works

---

## 🔍 **FORM INPUTS TEST**

### **Text Visibility**
- [ ] Login form - text visible when typing
- [ ] Register form - text visible when typing
- [ ] Contact form - text visible when typing
- [ ] Questionnaire forms - text visible
- [ ] All dropdowns show text clearly

---

## 🌍 **ADDRESS & DATA TEST**

### **Check Addresses Show Berlin/Munich**
- [ ] Patient 1 (Sarah): Kurfürstendamm 195, Berlin
- [ ] Patient 2 (John): Maximilianstraße 42, Munich
- [ ] Dr. Watson: Friedrichstraße 95, Berlin
- [ ] Dr. Chen: Leopoldstraße 139, Munich
- [ ] Pharmacy 1: Alexanderplatz 1, Berlin
- [ ] Pharmacy 2: Marienplatz 8, Munich

### **Phone Numbers**
- [ ] All show German format (+49 30/89...)

---

## **NAVIGATION & UX TEST**

### **Scroll to Top**
- [ ] Click footer link → page scrolls to top
- [ ] Logout → page scrolls to top
- [ ] Navigate between pages → scrolls to top

### **Logo Behavior**
- [ ] Not logged in → Logo goes to landing page
- [ ] Logged in as patient → Logo goes to patient dashboard
- [ ] Logged in as doctor → Logo goes to doctor dashboard
- [ ] Logged in as pharmacy → Logo goes to pharmacy dashboard

### **Logout**
- [ ] User menu dropdown works
- [ ] Click "Sign out" → returns to landing page
- [ ] After logout → can access landing, login, register only

---

## 🎨 **VISUAL TEST**

### **Landing Page Interactive Elements**
- [ ] Book Your Slot calendar - hover effects work
- [ ] Day buttons scale on hover
- [ ] Selected day shows green highlight
- [ ] Time slots scale and highlight when selected
- [ ] Button shows: "Confirm Booking → [TIME] on Oct [DAY]"
- [ ] Toast notifications appear on selection

### **Responsive Design**
- [ ] Site works on desktop (1920px+)
- [ ] Site works on tablet (768px)
- [ ] Site works on mobile (375px)

---

## 💉 **BOTOX FEATURES TEST**

### **Prescriptions**
- [ ] Patient dashboard shows 3 active Botox prescriptions:
  - [ ] Main Botox injection (20 units, €350)
  - [ ] Arnica Montana (post-treatment)
  - [ ] Ibuprofen (pain management)
- [ ] Each shows medication name, dosage, status
- [ ] Topical Lidocaine shows in filled prescriptions

### **Doctor Visibility**
- [ ] All 3 doctors show on landing page
- [ ] Dr. Alexandra Hartley photo loads
- [ ] Dr. Hartley shows award badge
- [ ] All doctors show qualifications

---

## 📱 **DEMO FLOW - RECOMMENDED PATH**

### **For Tomorrow's Demo:**

1. **Start:** https://broddo-baggins.github.io/DoktorABC-Mock/
2. **Show Landing:**
   - Interactive booking calendar
   - Meet Your Practitioners section
   - Scroll through features
3. **Patient Flow:**
   - Click Login → Use demo button "Patient (Sarah)"
   - Show dashboard with prescriptions
   - Click "New Consultation" → browse treatments
   - Show treatment detail with pricing
4. **Doctor Portal:**
   - Logout → Login as "Dr. Emily Watson"
   - Show doctor dashboard (different navigation!)
   - Show prescriptions management
5. **Pharmacy Portal:**
   - Logout → Login as Pharmacy
   - Show Berlin pharmacy with orders
   - Show inventory management
6. **Multi-Role Demo:**
   - Show how different roles see different interfaces
   - Show role-based navigation (staff don't see shopping)

---

##  **KNOWN LIMITATIONS (Expected Behavior)**

- Refreshing a route may show `?/route` in URL (SPA redirect - NORMAL)
- No actual video calls (mock interface only)
- No real payments (simulation only)
- All data in localStorage (resets on cache clear)
- Mock data (pre-populated for demo)

---

## **FINAL PRE-DEMO CHECKS**

**Night Before:**
- [ ] Open site in incognito window
- [ ] Test full patient flow (5 minutes)
- [ ] Test doctor login (2 minutes)
- [ ] Clear browser cache
- [ ] Bookmark demo URL

**Demo Day Morning:**
- [ ] Test site loads (2 minutes before demo)
- [ ] Open in presentation browser
- [ ] Have demo credentials ready
- [ ] Close unnecessary tabs

---

## 📞 **DEMO CREDENTIALS QUICK REFERENCE**

**Patients:**
- `sarah.johnson@email.com` / `demo123`
- `john.smith@email.com` / `demo123`

**Doctors:**
- `dr.emily.watson@doktorabc.com` / `demo123`
- `dr.james.chen@doktorabc.com` / `demo123`

**Pharmacy:**
- `central.pharmacy@partner.com` / `demo123`

**Support:**
- `tech.support@doktorabc.com` / `demo123`

**Customer Service:**
- `cs.lead@doktorabc.com` / `demo123`

---

## **TEST SUMMARY**

**Total Items:** 100+ test points
**Critical for Demo:** ~20 key flows
**Time to Test All:** ~30 minutes
**Recommended Pre-Demo Test:** ~10 minutes (critical path only)

**DEMO READY! **

