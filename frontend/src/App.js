import FloatingShapes from './components/FloatingShapes';
import {Routes, Route, Navigate} from "react-router-dom"
import SignUpPage from './Pages/SignUpPage';
import LoginPage from './Pages/LoginPage';
import EmailVerificationPage from './Pages/EmailVerificationPage';
import ForgotPassword from './Pages/ForgotPassword';
import ResetPassword from './Pages/ResetPassword';
// import Bridge from './Pages/Bridge';
import LoadingSpinner from './components/LoadingSpinner';
import Dashboard from './Pages/Dashboard';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authstore';
import { useEffect } from 'react';

const ProtectedRoute = ({children})=>{
  const {isAuthenticated, user} = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to='/login' replace/>
  }

  if (!user.isVerified) {
    return <Navigate to='/verify-email' replace/>
  }

  return children
}

const RedirectAuthenicatedUser =({children})=>{
  const {isAuthenticated, user} = useAuthStore();
  
  if(isAuthenticated && user.isVerified){
    return <Navigate to='/' replace/>
  }

  return children;
}

export default function App() {
  const {isAuthenticated, user, checkAuth,isCheckingAuth} = useAuthStore();

  useEffect(()=>{
    checkAuth()
  },[checkAuth])

  console.log(isAuthenticated);
  console.log(user);

  if(isCheckingAuth) return <LoadingSpinner/>
  
  return (
    // <>
    // <Routes>
    // <Route  path="/bridge" element={<Bridge/>}/>

    // </Routes>
    // </>

    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 
    to-emerald-900 flex items-center justify-center relative overflow-hidden">
      <FloatingShapes color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0}/>
      <FloatingShapes color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" delay={5}/>
      <FloatingShapes color="bg-lime-500" size="w-32 h-32" top="40%" left="-10%" delay={2}/>
      <Routes>
        <Route  path="/" element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
        }/>

        <Route  path="/signup" element={
          <RedirectAuthenicatedUser>
            <SignUpPage/>
          </RedirectAuthenicatedUser>}/>

        <Route  path="/login" element={
          <RedirectAuthenicatedUser>
            <LoginPage/>
          </RedirectAuthenicatedUser>}/>


        <Route  path="/verify-email" element={<EmailVerificationPage/>}/>
        <Route  path="/forgot-password" element={          
          <RedirectAuthenicatedUser>
            <ForgotPassword/>
          </RedirectAuthenicatedUser>}/>
        <Route  path="/reset-password/:token" element={
          <RedirectAuthenicatedUser>
            <ResetPassword/>
          </RedirectAuthenicatedUser>}/>

      </Routes>
      <Toaster/>
    </div>
  )
}