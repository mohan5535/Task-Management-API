import {useCallback,useEffect,useState} from 'react'
import {Link,useNavigate,useParams} from 'react-router-dom'
import {deleteTask,getTask} from '../services/api'
import {useAuth} from '../context/AuthContext'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
export default function TaskDetails(){
 const {id}=useParams();const {token}=useAuth();const nav=useNavigate();const [task,setTask]=useState(null);const [loading,setLoading]=useState(true);const [error,setError]=useState('');const [deleting,setDeleting]=useState(false)
 const load=useCallback(async()=>{setLoading(true);setError('');try{const d=await getTask(token,id);setTask(d.task)}catch(e){setError(e.message)}finally{setLoading(false)}},[token,id])
 useEffect(()=>{load()},[load])
 async function remove(){if(!window.confirm('Delete this task? This action cannot be undone.'))return;setDeleting(true);try{await deleteTask(token,id);nav('/tasks')}catch(e){setError(e.message);setDeleting(false)}}
 if(loading)return <LoadingState label="Loading task..."/>;if(error)return <ErrorState message={error} onRetry={load}/>
 return <section className="detail-layout"><Link className="back-link" to="/tasks">← Back to tasks</Link><div className="detail-card"><div className="task-card-top"><span className={`status status-${task.status}`}>{task.status}</span><span className="task-id">#{task.id}</span></div><h1>{task.title}</h1><p className="detail-description">{task.description||'No description provided.'}</p><div className="detail-actions"><Link className="button primary" to={`/tasks/${task.id}/edit`}>Edit Task</Link><button className="button danger" onClick={remove} disabled={deleting}>{deleting?'Deleting...':'Delete Task'}</button></div></div></section>
}
