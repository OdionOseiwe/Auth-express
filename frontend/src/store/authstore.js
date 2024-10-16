import {create} from "zustand"
import axios from 'axios'

const HOST_URL = import.meta.env.MODE === "development" ?"http://localhost:5000/api/auth" : "api/auth"

axios.defaults.withCredentials = true;

export const useAuthStore = create((set)=>({
    user:null,
    isAuthenticated:false,
    error:null,
    isLoading:false,
    isCheckingAuth:true,
    message:null,

    signUp: async(email, password, name)=>{
        set({isLoading:true,error:null});
        try {
            const response = await axios.post(`${HOST_URL}/signup`, {email,password, name});
            set({user:response.data.user, isAuthenticated:true,isLoading:false})
        } catch (error) {
            set({error:error.response.data.msg ||"Error signing up", isLoading:false})
            throw error
        }
    },

    verifyEmail: async(code)=>{
        set({isLoading:true, error:null})
        try {
            const response = await axios.post(`${HOST_URL}/verify-email`,{code})
            set({user:response.data.user, isAuthenticated:true,isLoading:false})
        
        } catch (error) {
            set({error:error.response.data.msg|| "Error verifing email", isLoading:false})
            throw error
        }
    },

    checkAuth: async()=>{
        set({isCheckingAuth:true,error:null})
        // await new Promise((resolve, reject) => {
        //     setTimeout(resolve, 1000)
        // })
        try {
            const response = await axios.get(`${HOST_URL}/check-auth`,{ 
                withCredntials: true,
             })
            set({user:response.data.user, isCheckingAuth:false, isAuthenticated:true})
        } catch (error) {
            set({error:error.response.data.msg|| "Error checking Auth", isCheckingAuth:false})
            throw error
        }
    },

    login: async(email, password)=>{
        set({isLoading:true,error:null});
        try {
            const response = await axios.post(`${HOST_URL}/login`, {email,password});
            set({user:response.data.user, isAuthenticated:true,isLoading:false})
        } catch (error) {
            set({error:error.response.data.msg ||"Error logining in", isLoading:false})
            throw error
        }
    },

    Logout: async() =>{
        set({isLoading:true, error:null});
        try {
            await axios.post(`${HOST_URL}/logout`);
            set({user:null,isAuthenticated:false, error:null, isLoading:false})
        } catch (error) {
            set({error:"Error Loging out",isLoading:false});
            throw error;
        }
    },

    forgotPassword: async(email)=>{
        set({isLoading:true, error:null, message:null})
        try {
            const response = await axios.post(`${HOST_URL}/forgot-password`,{email})
            set({message:response.data.msg, isAuthenticated:true,isLoading:false})
        
        } catch (error) {
            set({error:error.response.data.msg || "Error sending reset email", isLoading:false})
            throw error
        }
    },

    resetPassword: async(token, password)=>{
        set({isLoading:true, error:null, message:null})
        try {
            const response = await axios.post(`${HOST_URL}/reset-password/${token}`,{password})
            set({message:response.data.msg, isAuthenticated:true,isLoading:false})
        
        } catch (error) {
            set({error:error.response.data.msg || "Error reseting password", isLoading:false})
            throw error
        }
    }

}))