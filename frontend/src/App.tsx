import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import Orders from './pages/Orders';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import ManageOrders from './pages/ManageOrders';
import ManageMenu from './pages/ManageMenu';
import { useAuth } from './contexts/AuthContext';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

function ManagerRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  if (!user || user.role !== 'manager') {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout>
                  <Menu />
                </Layout>
              </PrivateRoute>
            }
          />
          
          <Route
            path="/menu"
            element={
              <PrivateRoute>
                <Layout>
                  <Menu />
                </Layout>
              </PrivateRoute>
            }
          />
          
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <Layout>
                  <Orders />
                </Layout>
              </PrivateRoute>
            }
          />
          
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <Layout>
                  <Chat />
                </Layout>
              </PrivateRoute>
            }
          />
          
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Layout>
                  <Profile />
                </Layout>
              </PrivateRoute>
            }
          />
          
          {/* Manager Routes */}
          <Route
            path="/dashboard"
            element={
              <ManagerRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ManagerRoute>
            }
          />
          
          <Route
            path="/manage/orders"
            element={
              <ManagerRoute>
                <Layout>
                  <ManageOrders />
                </Layout>
              </ManagerRoute>
            }
          />
          
          <Route
            path="/manage/menu"
            element={
              <ManagerRoute>
                <Layout>
                  <ManageMenu />
                </Layout>
              </ManagerRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
