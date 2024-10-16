import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {motion} from "framer-motion"
import { useAuthStore } from '../store/authstore';
import toast from 'react-hot-toast';

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["","","","","",""])
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const {verifyEmail,error,isLoading} = useAuthStore(); 

  const handleChange=(index, value)=>{
    const newCode = [...code];
    //handle pasted content

    if(value.length > 1){      
      const pastedCode = value.slice(0,6).split("")
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || ""
      }
      setCode(newCode);
      //focus on the last empty input or the first
      const lastFilledIndex = newCode.findLastIndex((digit)=>digit !== '')
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5
      inputRefs.current[focusIndex].focus()
      
    }else{
      newCode[index] = value
      setCode(newCode);

      if(value && index < 5){
        inputRefs.current[index + 1].focus()
      }
    }
    
  }

  const handleKeyDown=(index,e)=>{
    if(e.key === "Backspace" && !code[index] && index > 0){
      inputRefs.current[index - 1].focus();
    }
  }

  const handleSubmit = async(e)=>{
    e.preventDefault();  
    const verificationCode = code.join("");      
    try {
      await verifyEmail(verificationCode);
      navigate("/");
      toast.success("Email verified succesfully");
    } catch (error) {
        console.log("error while verifing email",error);
    }
  }

  useEffect(()=>{
    if(code.every(digit => digit !== '')){
      handleSubmit(new Event('submit'));
    }
  },[code])

  return (
    <div className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-blur-xl backdrop-filter rounded-xl shadow-xl overflow-hidden'>
      <motion.div
      intial={{opacity:0,y:20}}
      animate={{opacity:1,y:0}}
      transition={{duration:0.5}}
      className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-blur-xl backdrop-filter rounded-2xl shadow-2xl p-8'>
          <h2 className='text-3xl mb-6 text-center font-bold bg-gradient-to-r from-green-400 to-emerald-500 
          text-transparent bg-clip-text'>
            verify Your Email
          </h2>
          <p className='text-center text-gray-300 mb-4'>
            Enter the 6-digits sent to your email address
          </p>
          <form onSubmit={handleSubmit} className='space-y-6' >
            <div className='flex justify-between'>
              {code.map((digit, index)=>(
                <input type="text" 
                key={index}
                ref={(el)=>(inputRefs.current[index]=el)}
                maxLength='6'
                value={digit}
                onChange={(e)=>handleChange(index,e.target.value)}
                onKeyDown={(e)=> handleKeyDown(index,e)}
                className='w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-400 
                rounded-lg focus:border-green-500 focus:outline-none '
                />
              ))}
            </div>
            {error && <p className='text-xl text-red-600'>{error}</p>}
            <motion.button
            className='text-center bg-gradient-to-r from-emerald-500 to-green-600 text-white mt-4 p-3 rounded-xl w-full
            shadow-lg hover:bg-gradient-to-r hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 
            transition duration-200 '
            whileHover={{scale:1.02}}
            whileTap={{scale:0.98}}
            type='submit'
            disabled={isLoading || code.some((digit)=>!digit)}>
              {isLoading ? "verifying":"verify"}
            </motion.button>
          </form>
      </motion.div>
    </div>
  )
}

export default EmailVerificationPage
