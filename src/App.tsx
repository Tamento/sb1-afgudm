import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CrisisLog from './components/CrisisLog';
import MedicationLog from './components/MedicationLog';
import SleepLog from './components/SleepLog';
import Notes from './components/Notes';
import Export from './components/Export';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  return user ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="crises" element={<CrisisLog />} />
          <Route path="medications" element={<MedicationLog />} />
          <Route path="sleep" element={<SleepLog />} />
          <Route path="notes" element={<Notes />} />
          <Route path="export" element={<Export />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;