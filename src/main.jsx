import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import './index.css'

// Lazy loaded components
const App = lazy(() => import('./App.jsx'))
const Initiatives = lazy(() => import('./Initiatives.jsx'))
const Legalities = lazy(() => import('./Legalities.jsx'))
const Donate = lazy(() => import('./Donate.jsx'))
const AboutUs = lazy(() => import('./AboutUs.jsx'))
const ContactUs = lazy(() => import('./ContactUs.jsx'))
const News = lazy(() => import('./News.jsx'))
const Login = lazy(() => import('./Login.jsx'))
const AdminEnquiries = lazy(() => import('./AdminEnquiries.jsx'))
const AdminDashboard = lazy(() => import('./AdminDashboard.jsx'))
const AdminWebsiteDashboard = lazy(() => import('./AdminWebsiteDashboard.jsx'))
const AdminDonations = lazy(() => import('./AdminDonations.jsx'))
const AdminDonors = lazy(() => import('./AdminDonors.jsx'))
const AdminIndividualDonors = lazy(() => import('./AdminIndividualDonors.jsx'))
const AdminCorporateDonors = lazy(() => import('./AdminCorporateDonors.jsx'))
const AdminInternationalNGOs = lazy(() => import('./AdminInternationalNGOs.jsx'))
const AdminApplicationWindows = lazy(() => import('./AdminApplicationWindows.jsx'))
const Generate80G = lazy(() => import('./Generate80G.jsx'))
const AdminSettings = lazy(() => import('./AdminSettings.jsx'))
const AdminInitiatives = lazy(() => import('./AdminInitiatives.jsx'))
const AdminImpactStats = lazy(() => import('./AdminImpactStats.jsx'))
const AdminPartners = lazy(() => import('./AdminPartners.jsx'))
const AdminHeroSlides = lazy(() => import('./AdminHeroSlides.jsx'))
const AdminAbout = lazy(() => import('./AdminAbout.jsx'))
const AdminCauses = lazy(() => import('./AdminCauses.jsx'))
const AdminNews = lazy(() => import('./AdminNews.jsx'))
const AdminCTA = lazy(() => import('./AdminCTA.jsx'))
const AdminLegalities = lazy(() => import('./AdminLegalities.jsx'))
const AdminHeaderFooter = lazy(() => import('./AdminHeaderFooter.jsx'))
const AdminLandingPage = lazy(() => import('./AdminLandingPage.jsx'))
const AdminNavbar = lazy(() => import('./AdminNavbar.jsx'))
const AdminWebsiteLayout = lazy(() => import('./AdminWebsiteLayout.jsx'))
const AdminDonate = lazy(() => import('./AdminDonate.jsx'))
const AdminUsers = lazy(() => import('./AdminUsers.jsx'))
const AdminAuditLogs = lazy(() => import('./AdminAuditLogs.jsx'))
const CertificateHistory = lazy(() => import('./CertificateHistory.jsx'))
const LandingPage = lazy(() => import('./LandingPage.jsx'))

// Non-lazy components (needed for initial render or wrappers)
import ScrollToTop from './components/ScrollToTop.jsx'
import AdminLayout from './components/AdminLayout.jsx'

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<App />} />
          <Route path="/initiatives" element={<Initiatives />} />
          <Route path="/legal" element={<Legalities />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/news" element={<News />} />
          <Route path="/page/:slug" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Admin/Staff Routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/website" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminWebsiteDashboard />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/enquiries" element={
            <ProtectedRoute>
              <AdminLayout><AdminEnquiries /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/donations" element={
            <ProtectedRoute>
              <AdminLayout><AdminDonations /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/donors" element={
            <ProtectedRoute>
              <AdminLayout><AdminDonors /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/donors/individual" element={
            <ProtectedRoute>
              <AdminLayout><AdminIndividualDonors /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/donors/corporate" element={
            <ProtectedRoute>
              <AdminLayout><AdminCorporateDonors /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/donors/international" element={
            <ProtectedRoute>
              <AdminLayout><AdminInternationalNGOs /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/applications" element={
            <ProtectedRoute>
              <AdminLayout><AdminApplicationWindows /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/generate-80g" element={
            <ProtectedRoute>
              <AdminLayout><Generate80G /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/history" element={
            <ProtectedRoute>
              <AdminLayout><CertificateHistory /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/initiatives" element={
            <ProtectedRoute>
              <AdminLayout><AdminInitiatives /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/impact-stats" element={
            <ProtectedRoute>
              <AdminLayout><AdminImpactStats /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/donate" element={
            <ProtectedRoute>
              <AdminLayout><AdminDonate /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/partners" element={
            <ProtectedRoute>
              <AdminLayout><AdminPartners /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/hero-slides" element={
            <ProtectedRoute>
              <AdminLayout><AdminHeroSlides /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/about" element={
            <ProtectedRoute>
              <AdminLayout><AdminAbout /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/causes" element={
            <ProtectedRoute>
              <AdminLayout><AdminCauses /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/news" element={
            <ProtectedRoute>
              <AdminLayout><AdminNews /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/cta" element={
            <ProtectedRoute>
              <AdminLayout><AdminCTA /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/header-footer" element={
            <ProtectedRoute>
              <AdminLayout><AdminHeaderFooter /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/landing-pages" element={
            <ProtectedRoute>
              <AdminLayout><AdminLandingPage /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/navbar" element={
            <ProtectedRoute>
              <AdminLayout><AdminNavbar /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/legal" element={
            <ProtectedRoute>
              <AdminLayout><AdminLegalities /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/website-layout" element={
            <ProtectedRoute>
              <AdminLayout><AdminWebsiteLayout /></AdminLayout>
            </ProtectedRoute>
          } />
          
          {/* Admin-Only Routes */}
          <Route path="/admin/settings" element={
            <ProtectedRoute roles={['ADMIN']}>
              <AdminLayout><AdminSettings /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute roles={['ADMIN']}>
              <AdminLayout><AdminUsers /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/audit-log" element={
            <ProtectedRoute roles={['ADMIN']}>
              <AdminLayout><AdminAuditLogs /></AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  </React.StrictMode>
)
