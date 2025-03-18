import React from 'react'
import { useRef } from 'react';
import Home from './pages/Home'
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import MyRides from './pages/MyRides';
import CarpoolProfiles from './pages/Profile';
import Auth from './pages/Auth';
import PaymentsPage from './pages/PaymentPage';
import FindRides from './pages/FindRides';
import NotFoundPage from './pages/Page404';
import { useSelector } from 'react-redux';
import { Route,Routes, Navigate } from 'react-router-dom';
import DriverDashboard from './pages/DriverDashBoard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const App = () => {
  const {user} = useSelector(state => state.user);
  const formRef = useRef(null);
  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const ProtectedRoute = ({ children }) => {
    
    if (!user) {
      return <Navigate to="/Auth" replace />;
    }
 
    return children;
  };
  return(
    <div className='app'>
      <Navbar login = {user}  scrollToForm = {scrollToForm}/>
      <ToastContainer/>
      <main>
      <Routes>
        <Route path='/' element = { <Home  formRef = {formRef} scrollToForm = {scrollToForm}/> }/>
        <Route path = '/Auth' element=  {
          user? <Navigate to = '/'/> : <Auth/>
        }/>
       
       {/*Protected Routes */}
        <Route path='/payments' element = {
          <ProtectedRoute>
            <PaymentsPage/>
          </ProtectedRoute>
        }/>
        <Route path='Profile' element = {
          <ProtectedRoute>
            <CarpoolProfiles/>
          </ProtectedRoute>
        }/>
        <Route path='/my-rides' element = {
          <ProtectedRoute>
            <MyRides/>
          </ProtectedRoute>
        }/>
        <Route path='/bookRide' element = {
          <ProtectedRoute>
            <FindRides/>
          </ProtectedRoute>
        }/>
        <Route path="/driver-dashboard" element={
          <ProtectedRoute>
          <DriverDashboard />
            </ProtectedRoute>
          }/>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </main>
      <Footer/>
    </div>
  )
}

export default App