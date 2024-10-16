import React, { useState } from 'react'
import {motion} from "framer-motion"
import { useNavigate, useParams} from 'react-router-dom';
import Input from '../components/Input';
import {Loader, Lock} from "lucide-react"
import { useAuthStore } from '../store/authstore';
import toast from 'react-hot-toast';


const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const {isLoading,resetPassword,error, message} = useAuthStore() 
  const {token} = useParams()
  const navigate = useNavigate()

  const handleSubmit=async(e)=>{
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("Password don't match");
      return
    }

    try {
      await resetPassword(token,password);
      toast.success("password set succesfully, redirecting to login page");
      setTimeout(()=>{
        navigate("/login")
      },3000)
    } catch (error) {
      console.log(error);
      toast.error(error.message || "error while resetting password")
      
    }
  }
  return (
    <motion.div intial={{opacity:0,y:20}}
    animate={{opacity:1,y:0}}
    transition={{duration:0.5}}
    className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-blur-xl backdrop-filter rounded-2xl shadow-2xl'>
      <div className='p-8'>
        <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
          Reset Password
        </h2>
        {error && <p className='text-sm text-red-500 mb-4' >{error}</p>}
        {isLoading && <p className='text-sm text-green-500 mb-4' >{message}</p>}
        <form onSubmit={handleSubmit}>
        <Input 
          icon={Lock}
          placeholder="New Password"
          type='password'
          value={password}
          onChange ={(e)=>setPassword(e.target.value)}
          required
          />

        <Input 
          icon={Lock}
          placeholder="Confirm New Password"
          type='password'
          value={confirmPassword}
          onChange ={(e)=>setConfirmPassword(e.target.value)}
          required
          />
          <motion.button
            className='text-center bg-gradient-to-r from-emerald-500 to-green-600 text-white mt-4 p-3 rounded-xl w-full
            shadow-lg hover:bg-gradient-to-r hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 
            transition duration-200 '
            whileHover={{scale:1.02}}
            whileTap={{scale:0.98}}
            type='submit'>
                {isLoading ? <Loader className='size-6 animate-spin mx-auto'/> : "Reset Password"}
          </motion.button>
        </form>
      </div>
    </motion.div>
  )
}

export default ResetPassword
