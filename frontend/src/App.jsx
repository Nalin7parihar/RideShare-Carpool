import React from 'react'
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Page Imports
import Home from './pages/Home'
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import MyRides from './pages/MyRides';
import CustomerProfile from './components/CustomerProfile';
import DriverProfile from './components/DriverProfile';
import Auth from './pages/Auth';
import PaymentsPage from './pages/PaymentPage';
import FindRides from './pages/FindRides';
import NotFoundPage from './pages/Page404';
import DriverDashboard from './pages/DriverDashBoard';

const App = () => {
  const { user } = useSelector(state => state.user);
  const { driver } = useSelector(state => state.driver);
  const formRef = useRef(null);

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const ProtectedRoute = ({ children, requireDriver = false }) => {
    // If route requires driver and no driver is logged in
    if (requireDriver && !driver) {
      return <Navigate to="/Auth" replace />;
    }
    
    // If route does not require driver and no user is logged in
    if (!requireDriver && !user && !driver) {
      return <Navigate to="/Auth" replace />;
    }
 
    return children;
  };

  return(
    <div className='app'>
      <Navbar userLogin={user} driverLogin = {driver} scrollToForm={scrollToForm}/>
      <ToastContainer/>
      <main>
      <Routes>
        <Route path='/' element={<Home formRef={formRef} scrollToForm={scrollToForm}/> }/>
        
        {/* Authentication Route with Multiple Conditions */}
        <Route path='/Auth' element={
          driver ? <Navigate to='/driver-dashboard' /> : 
          (user ? <Navigate to='/' /> : <Auth />)
        }/>
       
        {/* Protected User Routes */}
        <Route path='/payments' element={
          <ProtectedRoute>
            <PaymentsPage/>
          </ProtectedRoute>
        }/>
        <Route path='/CustomerProfile' element={
          <ProtectedRoute>
            <CustomerProfile/>
          </ProtectedRoute>
        }/>
        <Route path='/DriverProfile' element={
          <ProtectedRoute>
            <DriverProfile/>
          </ProtectedRoute>
        }/>
        <Route path='/my-rides' element={
          <ProtectedRoute>
            <MyRides/>
          </ProtectedRoute>
        }/>
        <Route path='/bookRide' element={
          <ProtectedRoute>
            <FindRides/>
          </ProtectedRoute>
        }/>

        {/* Protected Driver Routes */}
        <Route path="/driver-dashboard" element={
          <ProtectedRoute requireDriver={true}>
            <DriverDashboard />
          </ProtectedRoute>
        }/>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </main>
    
    </div>
  )
}

export default App