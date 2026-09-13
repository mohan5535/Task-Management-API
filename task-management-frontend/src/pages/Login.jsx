import {useState} from 'react'
import {Link,useLocation,useNavigate} from 'react-router-dom'
import {loginUser} from '../services/api'
import {useAuth} from '../context/AuthContext'
export default function Login(){
 const [form,setForm]=useState({email:'',password:''});const [error,setError]=useState('');const [loading,setLoading]=useState(false);const {login}=useAuth();const nav=useNavigate();const loc=useLocation()
 async function submit(e){e.preventDefault();setError('');if(!form.email.trim()||!form.password)return setError('Please enter both email and password.');setLoading(true);try{const d=await loginUser(form);login(d.token);nav(loc.state?.from||'/tasks',{replace:true})}catch(e){setError(e.message)}finally{setLoading(false)}}
 return <section className="auth-layout"><div className="auth-intro"><span className="eyebrow">Task management</span><h1>Stay focused. Get things done.</h1><p>Manage your work with a clean dashboard connected to your REST API.</p></div><form className="form-card auth-card" onSubmit={submit}><h2>Welcome back</h2><p className="muted">Sign in to your TaskFlow account.</p>{error&&<div className="alert" role="alert">{error}</div>}<div className="field"><label>Email</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com"/></div><div className="field"><label>Password</label><input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Enter your password"/></div><button className="button primary full-width" disabled={loading}>{loading?'Signing in...':'Sign In'}</button><p className="form-footer">Don't have an account? <Link to="/register">Create one</Link></p></form></section>
}
