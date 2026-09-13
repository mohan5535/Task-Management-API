import {createContext,useContext,useMemo,useState} from 'react'
const AuthContext=createContext(null)
export function AuthProvider({children}){
 const [token,setToken]=useState(()=>localStorage.getItem('taskflow_token'))
 const login=(value)=>{localStorage.setItem('taskflow_token',value);setToken(value)}
 const logout=()=>{localStorage.removeItem('taskflow_token');setToken(null)}
 const value=useMemo(()=>({token,isAuthenticated:Boolean(token),login,logout}),[token])
 return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export function useAuth(){const c=useContext(AuthContext);if(!c)throw new Error('useAuth must be used inside AuthProvider');return c}
