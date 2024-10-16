import React, { useState } from 'react'
import {motion} from "framer-motion"
import Input from '../components/Input';
import { ArrowLeft, Loader, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authstore';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isSubmitted, setSubmitted] = useState(false);

    const {isLoading,forgotPassword} = useAuthStore() 
    const handleSubmit=async(e)=>{
        e.preventDefault();
        await forgotPassword(email);
        setSubmitted(true)
    }
  return (
    <div>
      <motion.div
      intial={{opacity:0,y:20}}
      animate={{opacity:1,y:0}}
      transition={{duration:0.5}}
      className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-blur-xl backdrop-filter rounded-2xl shadow-2xl'>
        <div  className='p-8'>
            <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
                Forgot Password
            </h2>
            {!isSubmitted ?(
                <form onSubmit={handleSubmit}>
                    <p className='text-center text-gray-300 mb-6'>
                        Enter email address and we will sent you a  link to reset your password
                    </p>
                    <Input 
                    icon={Mail}
                    placeholder="email address"
                    type='email'
                    value={email}
                    onChange ={(e)=>setEmail(e.target.value)}
                    required
                    />
                    <motion.button
                    className='text-center bg-gradient-to-r from-emerald-500 to-green-600 text-white mt-4 p-3 rounded-xl w-full
                    shadow-lg hover:bg-gradient-to-r hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 
                    transition duration-200 '
                    whileHover={{scale:1.02}}
                    whileTap={{scale:0.98}}
                    type='submit'>
                        {isLoading ? <Loader className='size-6 animate-spin mx-auto'/> : "Send reset Link"}

                    </motion.button>
                </form>
            ):(
                <div className='text-center'>
                    <motion.div
                    intial={{scale:0}}
                    animate={{scale:1}}
                    transition={{type:"spring", stiffness:500 , damping:30}}
                    className='w-16 h-16  bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <Mail className='h-8 w-8 text-white '/>

                    </motion.div>
                    <p className='text-gray-300 mb-6'>
                        if an account exists for {email} you will get an email shortly.
                    </p>

                </div>
            )}
        </div>

        <div className='px-8 py-4 bg-gray-900 bg-opacity-50  flex justify-center'>
                <Link to ={"/login"} className='text-sm text-green-400 hover:underline flex items-center'>
                <ArrowLeft className='h-4 w-4 mr-2'/> Back to Login 
                </Link>
        </div>

      </motion.div>
    </div>
  )
}

export default ForgotPassword
