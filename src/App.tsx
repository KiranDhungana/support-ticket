import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
// import LoginPage from "./pages/Login/LoginPage";
import Landing from "./components/Landing"
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import UserDashboard from "./pages/Dashboard/UserDashboard";
import { MantineProvider } from "@mantine/core";
import { IconGauge, IconTicket, IconUsers, IconDashboard, IconFileText, IconBuilding, IconBell, IconNews, IconBriefcase, IconUser, IconPhoto, IconUpload } from "@tabler/icons-react";
import { SideBar } from "./layouts/SideBar";
import { AdminSidebar } from "./components/AdminSidebar";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { Navbar } from "./layouts/NavBar";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import UserTickets from "./pages/Usertickets/UserTickets";
import UserPage from "./pages/Users/UserPage";
import LoginPage from "./pages/Login/LoginPage";
import PublicNotices from "./pages/PublicNotices/PublicNotices";
import PublicNoticeManagement from "./pages/Admin/PublicNoticeManagement";
import StaffManagement from "./pages/Admin/StaffManagement";
import Announcements from "./pages/Announcements/Announcements";
import AnnouncementManagement from "./pages/Announcements/AnnouncementManagement";
import NewsManagement from "./pages/Admin/NewsManagement";
import JobManagement from "./pages/Admin/JobManagement";
import StaffPage from "./pages/Staff/Staff";
import NewsPage from "./pages/News/News";
import NewsArticle from "./pages/News/NewsArticle";
import Jobs from "./pages/Jobs/Jobs";
import BoardMembers from "./pages/BoardMembers/BoardMembers";
import BoardMinutes from "./pages/BoardMinutes/BoardMinutes";
import Principals from "./pages/Principals/Principals";
import BoardMemberManagement from "./pages/Admin/BoardMemberManagement";
import Schools from "./pages/Schools/Schools";
import Events from "./pages/Events/Events";
import VendorAgreement from "./pages/VendorAgreement/VendorAgreement";
import BannerManagement from "./pages/Admin/BannerManagement";
import WCSchoolBoard from "./pages/WCSchoolBoard/WCSchoolBoard";
import VisionStatement from "./pages/VisionStatement/VisionStatement";
import LunchAndBreakfast from "./pages/LunchAndBreakfast/LunchAndBreakfast";
import WellnessPolicy from "./pages/WellnessPolicy/WellnessPolicy";
import NonDiscriminationPolicy from "./pages/NonDiscriminationPolicy/NonDiscriminationPolicy";
import ChildFind from "./pages/ChildFind/ChildFind";
import BoardMinutesManagement from "./pages/Admin/BoardMinutesManagement";
import { getSettings } from "./services/api";
import Branding from "./pages/Admin/Branding";

function LayoutWithSidebar() {
  const location = useLocation();
  const { user } = useAuth();
  // Fetch dynamic settings once and cache in localStorage
  useEffect(() => {
    (async () => {
      try {
        const res = await getSettings();
        const logoUrl = res?.data?.data?.logoUrl;
        if (logoUrl) {
          localStorage.setItem('app_logo_url', logoUrl);
        }
      } catch {}
    })();
  }, []);

  // Show home navigation for non-logged-in users and public pages
  const isPublicPage = location.pathname === "/" || location.pathname === "/login" || location.pathname === "/public-notices" || location.pathname === "/announcements" || location.pathname === "/staff" || location.pathname === "/news" || location.pathname.startsWith("/news/article/") || location.pathname === "/jobs" || location.pathname === "/board-members" || location.pathname === "/board-minutes" || location.pathname === "/principals" || location.pathname === "/schools" || location.pathname === "/events" || location.pathname === "/vendor-agreement" || location.pathname === "/wc-school-board" || location.pathname === "/wc-school-board-minutes" || location.pathname === "/vision-statement" || location.pathname === "/lunch-and-breakfast" || location.pathname === "/wellness-policy" || location.pathname === "/non-discrimination-policy" || location.pathname === "/child-find";
  const isLoggedIn = !!user;
  
  // Check if current route is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/dashboard/admin';
  
  // Only show sidebar and admin/user navbar for logged-in users on dashboard pages
  const showSidebar = isLoggedIn && !isPublicPage;
  const showAdminNavbar = isLoggedIn && !isPublicPage;

  const userLinks = [
    { icon: IconGauge, label: "User Dashboard", path: "/dashboard/user" },
    { icon: IconTicket, label: "My Tickets", path: "/dashboard/tickets" },
  ];

  const adminLinks = [
    { icon: IconDashboard, label: 'Dashboard', path: '/admin' },
    { icon: IconFileText, label: 'Public Notices', path: '/admin/public-notices' },
    { icon: IconBell, label: 'Announcements', path: '/admin/announcements' },
    { icon: IconNews, label: 'News Management', path: '/admin/news' },
    { icon: IconBriefcase, label: 'Job Management', path: '/admin/jobs' },
    { icon: IconBuilding, label: 'Staff Management', path: '/admin/staff' },
    { icon: IconUsers, label: 'Board Members', path: '/admin/board-members' },
    { icon: IconUpload, label: 'Upload Minutes', path: '/admin/board-minutes' },
    { icon: IconUser, label: 'Users', path: '/admin/users' },
    { icon: IconPhoto, label: 'Banner Images', path: '/admin/banners' },
    { icon: IconPhoto, label: 'Branding', path: '/admin/branding' },
  ];
  
  return (
    <div style={{ display: "flex" }}>
      {showSidebar && isAdminRoute && <AdminSidebar links={adminLinks} />}
      {showSidebar && !isAdminRoute && <SideBar links={userLinks} />}
      <div 
        style={{ 
          flex: 1, 
          marginLeft: showSidebar ? '256px' : '0',
          transition: 'margin-left 0.3s ease'
        }}
        className="min-h-screen bg-gray-50 md:ml-64"
      >
        {showAdminNavbar && <Navbar />}
        <div style={{ paddingTop: showAdminNavbar ? '60px' : '0' }}>
          <Routes>
          <Route path="/" element={<Landing/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/public-notices" element={<PublicNotices/>} />
          <Route path="/announcements" element={<Announcements/>} />
          <Route path="/staff" element={<StaffPage/>} />
          <Route path="/news" element={<NewsPage/>} />
          <Route path="/news/article/:articleId" element={<NewsArticle/>} />
          <Route path="/jobs" element={<Jobs/>} />
          <Route path="/board-members" element={<BoardMembers/>} />
          <Route path="/board-minutes" element={<BoardMinutes/>} />
          <Route path="/principals" element={<Principals/>} />
          <Route path="/schools" element={<Schools/>} />
          <Route path="/events" element={<Events/>} />
          <Route path="/vendor-agreement" element={<VendorAgreement/>} />
          <Route path="/wc-school-board" element={<WCSchoolBoard/>} />
          <Route path="/wc-school-board-minutes" element={<BoardMinutes/>} />
          <Route path="/vision-statement" element={<VisionStatement/>} />
          <Route path="/lunch-and-breakfast" element={<LunchAndBreakfast/>} />
          <Route path="/wellness-policy" element={<WellnessPolicy/>} />
          <Route path="/non-discrimination-policy" element={<NonDiscriminationPolicy/>} />
          <Route path="/child-find" element={<ChildFind/>} />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/public-notices"
            element={
              <ProtectedRoute>
                <PublicNoticeManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/staff"
            element={
              <ProtectedRoute>
                <StaffManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <UserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/announcements"
            element={
              <ProtectedRoute>
                <AnnouncementManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/news"
            element={
              <ProtectedRoute>
                <NewsManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/jobs"
            element={
              <ProtectedRoute>
                <JobManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/board-members"
            element={
              <ProtectedRoute>
                <BoardMemberManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/banners"
            element={
              <ProtectedRoute>
                <BannerManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/branding"
            element={
              <ProtectedRoute>
                <Branding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/board-minutes"
            element={
              <ProtectedRoute>
                <BoardMinutesManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/user"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/tickets"
            element={
              <ProtectedRoute>
                <UserTickets />
              </ProtectedRoute>
            }
          />
        </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <MantineProvider>
      <Notifications />
      <GoogleOAuthProvider clientId="798412568937-7tee59mtj9t47e7b0c3n211bmg2rero0.apps.googleusercontent.com">
        <AuthProvider>
          <LayoutWithSidebar />
        </AuthProvider>
      </GoogleOAuthProvider>
    </MantineProvider>
  );
}

export default App;
