# 🎥 Demo Recording Guide - DoktorABC Mobile Mock

## 🚀 Before You Start

1. **Open the Application**
   - Navigate to: http://localhost:3000
   - The application should be running (npm run dev)
   - Use Chrome or Firefox for best results

2. **Prepare Your Screen**
   - Set browser to mobile view (375x812 - iPhone X size)
   - Or use responsive mode (Cmd+Opt+M on Mac, F12 → Toggle Device Toolbar)
   - Hide bookmarks bar for clean recording
   - Close unnecessary tabs

3. **Clear Previous Data (Optional)**
   - Open Dev Tools → Application → Local Storage
   - Clear doktorabc data if you want a fresh start

---

## 📱 Suggested Demo Flow (15-20 minutes)

### **Part 1: Public Experience (3 min)**

**Landing Page**
1. Show hero section with value proposition
2. Scroll through "How It Works" (3 steps)
3. Point out trust indicators (600K+ patients, ratings)
4. Browse treatment categories
5. View testimonials

**Browse Treatments**
1. Click "Browse Treatments" or navigate to `/categories`
2. Show filtering by category
3. Use search to find "Botox"
4. Click on "Botox for Forehead Lines"

**Treatment Details**
1. Show treatment information
2. Point out pricing (consultation + treatment)
3. Highlight benefits and suitability
4. Click "Start Consultation"

---

### **Part 2: Patient Journey (8 min)**

**Login**
- Click "Login" or you'll be redirected
- Use Quick Login dropdown: **"Patient - Sarah Johnson"**
- Or manually: `sarah.johnson@email.com` / `demo123`

**Medical Questionnaire**
1. Show 4-step questionnaire process
2. Fill out Step 1: Medical History (can use dummy data)
3. Show "Save Progress" feature
4. Complete through to Step 4 (Photo upload - optional)
5. Submit questionnaire

**Book Consultation**
1. Select **Dr. Emily Watson** (show doctor profiles)
2. Choose a date (tomorrow or any available)
3. Select time slot (e.g., 10:00 AM)
4. Review summary sidebar
5. Click "Confirm Booking"

**Consultation Waiting Room**
1. Show countdown timer
2. Highlight pre-consultation checklist
3. Click "Join Consultation" (works immediately in demo)

**Treatment Plan**
1. Review doctor's approval
2. Show treatment details and pricing
3. Click "Book Treatment Appointment" (for aesthetic) or "Proceed to Payment" (for medication)

**Book Treatment at Clinic** (If aesthetic)
1. Select a partner clinic (show ratings, distance)
2. Choose appointment date and time
3. Review pre-treatment instructions
4. Confirm booking

**Payment**
1. Show order summary
2. Use demo card: `4242 4242 4242 4242`
3. Any future expiry date (e.g., 12/25)
4. Any CVV (e.g., 123)
5. Complete payment

**Treatment Day** (If aesthetic)
1. Show treatment timeline
2. Click through check-in process
3. "Capture" before photos
4. Mark treatment complete
5. "Capture" after photos
6. View immediate aftercare instructions

**Aftercare Guide**
1. Show day-by-day instructions
2. Toggle between different days (Day 1, 2, 7, 14)
3. Highlight warning signs section
4. Schedule follow-up

**Follow-Up Scheduling**
1. Fill out satisfaction survey
2. Select follow-up date and time
3. Confirm appointment

**Patient Dashboard**
1. Show overview with stats
2. View upcoming appointments
3. Check active prescriptions
4. Review loyalty points

---

### **Part 3: Doctor Portal (3 min)**

**Logout & Login as Doctor**
1. Logout from patient account
2. Login as: `dr.emily.watson@doktorabc.com` / `demo123`

**Doctor Dashboard**
1. Show pending patient reviews
2. View today's schedule
3. Quick stats overview

**Patient Review**
1. Click on a pending review
2. Show patient questionnaire data
3. Add clinical notes
4. Click "Approve Treatment"

**Prescriptions & Availability**
1. Navigate to Prescription Management
2. Show active prescriptions
3. Go to Availability Management
4. Show schedule editing

---

### **Part 4: Pharmacy Portal (2 min)**

**Login as Pharmacy**
1. Logout and login as: `central.pharmacy@partner.com` / `demo123`

**Pharmacy Dashboard**
1. Show new orders count
2. Low stock alerts
3. Quick stats

**Order Management**
1. View prescription orders
2. Show order details
3. Mark order as "Preparing" then "Ready"

**Inventory Management**
1. Show stock levels
2. Point out low stock items (red badges)
3. Click "Reorder Stock" for low items

**Delivery Coordination**
1. Show today's deliveries
2. Delivery status tracking

---

### **Part 5: Support & Customer Service (2 min)**

**Support Engineer Portal**
1. Login as: `tech.support@doktorabc.com` / `demo123`
2. Show support dashboard
3. View open tickets
4. Navigate to System Monitoring
5. Show system health indicators

**Customer Service Portal**
1. Login as: `cs.lead@doktorabc.com` / `demo123`
2. Show customer inquiries
3. Open an inquiry
4. Send a reply
5. Mark as resolved

---

## 🎯 Key Points to Highlight

### **Patient Experience**
✅ Complete end-to-end journey from discovery to follow-up
✅ Modern, intuitive UI with clear progress indicators
✅ Multi-step questionnaire with auto-save
✅ Real-time booking with instant confirmation
✅ Comprehensive aftercare guidance

### **Doctor Portal**
✅ Efficient patient review workflow
✅ Clear prescription management
✅ Flexible availability scheduling
✅ Treatment monitoring capabilities

### **Pharmacy Portal**
✅ Streamlined order processing
✅ Smart inventory management with alerts
✅ Delivery coordination system

### **Support & CS**
✅ Ticket management system
✅ System health monitoring
✅ Customer inquiry handling

---

## 💡 Pro Tips for Recording

1. **Narration Examples:**
   - "Here we see the patient dashboard showing upcoming appointments..."
   - "The doctor can review the complete medical history before approving..."
   - "Low stock alerts help pharmacies maintain inventory levels..."

2. **Smooth Navigation:**
   - Use keyboard shortcuts (Tab to navigate, Enter to click)
   - Wait for page transitions to complete
   - Show loading states briefly

3. **Highlight Features:**
   - Zoom in on important elements
   - Pause on key information
   - Point out unique features (AI visualization, subscription offers)

4. **Error Prevention:**
   - If something doesn't load, refresh the page
   - Data persists in LocalStorage, so you can revisit flows
   - Use Cmd+Z if you need to go back

---

## 🔄 Quick Reset

To reset demo data and start fresh:
1. Open Developer Tools (F12)
2. Go to Application → Local Storage
3. Select http://localhost:3000
4. Right-click → Clear
5. Refresh page

---

## 📧 Demo Account Summary

| Role | Email | Password |
|------|-------|----------|
| Patient 1 | sarah.johnson@email.com | demo123 |
| Patient 2 | john.smith@email.com | demo123 |
| Doctor 1 | dr.emily.watson@doktorabc.com | demo123 |
| Doctor 2 | dr.james.chen@doktorabc.com | demo123 |
| Pharmacy 1 | central.pharmacy@partner.com | demo123 |
| Pharmacy 2 | manchester.pharmacy@partner.com | demo123 |
| Support | tech.support@doktorabc.com | demo123 |
| Customer Service | cs.lead@doktorabc.com | demo123 |

---

## 🎬 Final Checklist

- [ ] Application running smoothly
- [ ] Browser in mobile/responsive view
- [ ] Audio/video recording setup tested
- [ ] Demo script prepared
- [ ] LocalStorage cleared for fresh start
- [ ] All demo accounts tested
- [ ] Screen recording software ready
- [ ] Good lighting and clear voice
- [ ] Backup plan (screenshots) ready

**Ready to record!** 🎥

