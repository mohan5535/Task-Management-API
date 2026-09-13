import {useCallback,useEffect,useState} from 'react'
import {Link} from 'react-router-dom'
import {getTasks} from '../services/api'
import {useAuth} from '../context/AuthContext'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import TaskCard from '../components/TaskCard'
export default function Tasks(){
 const {token}=useAuth();const [tasks,setTasks]=useState([]);const [loading,setLoading]=useState(true);const [error,setError]=useState('')
 const load=useCallback(async()=>{setLoading(true);setError('');try{const d=await getTasks(token);setTasks(d.tasks||[])}catch(e){setError(e.message)}finally{setLoading(false)}},[token])
 useEffect(()=>{load()},[load])
 return <section><div className="page-heading"><div><span className="eyebrow">Dashboard</span><h1>My Tasks</h1><p className="muted">Live data loaded from the Node.js REST API.</p></div><Link className="button primary" to="/tasks/new">+ New Task</Link></div>{loading&&<LoadingState label="Loading your tasks..."/>}{!loading&&error&&<ErrorState message={error} onRetry={load}/>} {!loading&&!error&&!tasks.length&&<div className="empty-state"><div className="empty-icon">✓</div><h2>No tasks yet</h2><p>Create your first task to get started.</p><Link className="button primary" to="/tasks/new">Create Task</Link></div>}{!loading&&!error&&tasks.length>0&&<div className="task-grid">{tasks.map(t=><TaskCard key={t.id} task={t}/>)}</div>}</section>
}
