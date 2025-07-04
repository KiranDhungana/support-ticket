import { GoogleOAuthProvider } from "@react-oauth/google";
import { Routes, Route, useLocation } from "react-router-dom";
// import LoginPage from "./pages/Login/LoginPage";
import Landing from "./components/Landing"
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import UserDashboard from "./pages/Dashboard/UserDashboard";
import { MantineProvider } from "@mantine/core";
import { IconGauge, IconHome2, IconTicket, IconUsers } from "@tabler/icons-react";
import { SideBar } from "./layouts/SideBar";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { Navbar } from "./layouts/NavBar";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import UserTickets from "./pages/Usertickets/UserTickets";
import UserPage from "./pages/Users/UserPage";
import LoginPage from "./pages/Login/LoginPage";

function LayoutWithSidebar() {
  const location = useLocation();
  const { user } = useAuth();

  const hideSidebar = location.pathname === "/" || location.pathname === "/login";
  const hideNavbar = location.pathname === "/login";

  const links = [
    ...(user?.email === "utsab@wcpsb.com"
      ? [
          { icon: IconHome2, label: "Dashboard", path: "/dashboard/admin" },
          { icon: IconUsers, label: "Users", path: "/dashboard/users" },
        ]
      : [
          { icon: IconGauge, label: "User Dashboard", path: "/dashboard/user" },
          { icon: IconTicket, label: "My Tickets", path: "/dashboard/tickets" },
        ]),
  ];
  return (
    <div style={{ display: "flex" }}>
      {!hideSidebar && <SideBar links={links} />}
      <div style={{ flex: 1 }}>
        {!hideNavbar && !hideSidebar && <Navbar />}
        <Routes>
          <Route path="/" element={<Landing/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/users"
            element={
              <ProtectedRoute>
                <UserPage></UserPage>
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
