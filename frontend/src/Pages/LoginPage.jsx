import React, { useState } from 'react'
import {motion} from 'framer-motion'
import Input from '../components/Input'
import {Mail,Lock, Loader} from "lucide-react"
import {Link, useNavigate} from "react-router-dom"
import {useAuthStore} from '../store/authstore'


const LoginPage = () => {
  const [mail,setMail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const {login,isLoading,error} = useAuthStore();


  const handleSubmit= async(e)=>{
    e.preventDefault();
    await login(mail,password);
    navigate("/");

  }
  return (
    <motion.div
    intial={{opacity:0,y:20}}
    animate={{opacity:1,y:0}}
    transition={{duration:0.5}}
     className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
      <div className='p-8'>
        <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r  from-emerald-500 to-green-500 bg-clip-text text-transparent'>Welcome Back</h2>
        <form  onSubmit={handleSubmit} >
          <Input icon= {Mail} type="text" placeholder="Email Address" value={mail} onChange={(e)=>setMail(e.target.value)}/>
          <Input icon= {Lock} type="password" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
          <div className='text-green-400'>
            <Link to={"/forgot-password"}>
              Forgot Password ?
            </Link>
          </div>
          {error && <p className='mb-2 font-semibold text-red-500 mx-auto'></p>}
            <motion.button className='text-center bg-gradient-to-r from-emerald-500 to-green-600 text-white mt-4 p-3 rounded-xl w-full
            shadow-lg hover:bg-gradient-to-r hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 
            transition duration-200'
            whileHover={{scale:1.02}}
            whileTap={{scale:0.98}}
            type='submit'
            disabled={isLoading}>
              {isLoading ? <Loader className=' mx-auto w-6 h-6 animate-spin'/>:"login"}
            </motion.button>
        </form>
      </div>
    <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center text-gray-400'>
        Dont have an account? <Link to={'/signup'} className='text-green-400'>Sign up</Link>
    </div>
    </motion.div>
  )
}

export default LoginPage
