import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { AppStateProvider } from './contexts/AppStateContext'
import { ToastProvider } from './components/ui/Toast'
import Header from './components/Layout/Header'
import Footer from './components/Layout/Footer'

// Public Pages
import Landing from './pages/LandingNew'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Categories from './pages/Categories'
import TreatmentDetail from './pages/TreatmentDetail'
import QuickBook from './pages/QuickBook'
import HowItWorks from './pages/HowItWorks'
import About from './pages/About'
import Shipping from './pages/Shipping'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'

// Patient Pages
import PatientDashboard from './pages/Patient/Dashboard'
import Questionnaire from './pages/Patient/Questionnaire'
import BookConsultation from './pages/Patient/BookConsultation'
import ConsultationWaiting from './pages/Patient/ConsultationWaiting'
import TreatmentPlan from './pages/Patient/TreatmentPlan'
import BookTreatment from './pages/Patient/BookTreatment'
import Payment from './pages/Patient/Payment'
import TreatmentDay from './pages/Patient/TreatmentDay'
import Aftercare from './pages/Patient/Aftercare'
import FollowUp from './pages/Patient/FollowUp'
import Cart from './pages/Patient/Cart'
import Settings from './pages/Patient/Settings'

// Doctor Pages
import DoctorDashboard from './pages/Doctor/Dashboard'
import PatientReview from './pages/Doctor/PatientReview'
import VideoConsultation from './pages/Doctor/VideoConsultation'
import PrescriptionManagement from './pages/Doctor/PrescriptionManagement'
import TreatmentMonitoring from './pages/Doctor/TreatmentMonitoring'
import AvailabilityManagement from './pages/Doctor/AvailabilityManagement'

// Pharmacy Pages
import PharmacyDashboard from './pages/Pharmacy/Dashboard'
import OrderManagement from './pages/Pharmacy/OrderManagement'
import InventoryManagement from './pages/Pharmacy/InventoryManagement'
import DeliveryCoordination from './pages/Pharmacy/DeliveryCoordination'

// Support Pages
import SupportDashboard from './pages/Support/Dashboard'
import TicketManagement from './pages/Support/TicketManagement'
import SystemMonitoring from './pages/Support/SystemMonitoring'

// Customer Service Pages
import CustomerServiceDashboard from './pages/CustomerService/Dashboard'
import InquiryManagement from './pages/CustomerService/InquiryManagement'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

const AppContent = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/treatment/:id" element={<TreatmentDetail />} />
          <Route path="/quick-book/:id" element={<QuickBook />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<About />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />

          {/* Patient Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/questionnaire/:treatmentId"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Questionnaire />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book-consultation"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <BookConsultation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/consultation/waiting/:id"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <ConsultationWaiting />
              </ProtectedRoute>
            }
          />
          <Route
            path="/treatment-plan/:id"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <TreatmentPlan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book-treatment/:planId"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <BookTreatment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/:bookingId"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/treatment-day/:appointmentId"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <TreatmentDay />
              </ProtectedRoute>
            }
          />
          <Route
            path="/aftercare/:treatmentId"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Aftercare />
              </ProtectedRoute>
            }
          />
          <Route
            path="/follow-up/:treatmentId"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <FollowUp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Doctor Routes */}
          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/review/:patientId"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <PatientReview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/consultation/:sessionId"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <VideoConsultation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/prescriptions"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <PrescriptionManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/treatments"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <TreatmentMonitoring />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/availability"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <AvailabilityManagement />
              </ProtectedRoute>
            }
          />

          {/* Pharmacy Routes */}
          <Route
            path="/pharmacy/dashboard"
            element={
              <ProtectedRoute allowedRoles={['pharmacy']}>
                <PharmacyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pharmacy/orders"
            element={
              <ProtectedRoute allowedRoles={['pharmacy']}>
                <OrderManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pharmacy/inventory"
            element={
              <ProtectedRoute allowedRoles={['pharmacy']}>
                <InventoryManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pharmacy/delivery"
            element={
              <ProtectedRoute allowedRoles={['pharmacy']}>
                <DeliveryCoordination />
              </ProtectedRoute>
            }
          />

          {/* Support Routes */}
          <Route
            path="/support/dashboard"
            element={
              <ProtectedRoute allowedRoles={['support']}>
                <SupportDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/support/tickets"
            element={
              <ProtectedRoute allowedRoles={['support']}>
                <TicketManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/support/monitoring"
            element={
              <ProtectedRoute allowedRoles={['support']}>
                <SystemMonitoring />
              </ProtectedRoute>
            }
          />

          {/* Customer Service Routes */}
          <Route
            path="/customer-service/dashboard"
            element={
              <ProtectedRoute allowedRoles={['customer-service']}>
                <CustomerServiceDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer-service/inquiries"
            element={
              <ProtectedRoute allowedRoles={['customer-service']}>
                <InquiryManagement />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppStateProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </AppStateProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

