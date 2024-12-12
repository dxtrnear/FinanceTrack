// src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PrivateRoute } from './components/auth/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Advice from './pages/Advice';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/connexion" element={<Login />} />
        <Route path="/inscription" element={<SignUp />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route
          path="/tableau-de-bord"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/conseils"
          element={
            <PrivateRoute>
              <Advice />
            </PrivateRoute>
          }
        />
        <Route
          path="/parametres"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}