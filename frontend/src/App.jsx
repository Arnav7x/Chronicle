import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Signup from "./pages/signup";
import Login from "./pages/login";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/home";
import CreateBlog from "./pages/CreateBlog";
import AdminDashboard from "./pages/AdminDashboard";
import Analytics from "./pages/Analytics";
import AdminRoute from "./components/AdminRoutes";   // ✅ protect admin
import BlogDetails from "./pages/BlogDetails";       // ✅ new page

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/blog/:id" element={<BlogDetails />} />

          {/* Authenticated user routes */}
          <Route path="/create" element={<CreateBlog />} />

          {/* Admin-only route */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </BrowserRouter>

      {/* Notifications */}
      <Toaster position="top-right" reverseOrder={false} />
    </AuthProvider>
  );
}
