import {useCallback,useEffect,useState} from 'react'
import {Link,useNavigate,useParams} from 'react-router-dom'
import {getTask,updateTask} from '../services/api'
import {useAuth} from '../context/AuthContext'
import TaskForm from '../components/TaskForm'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
export default function EditTask(){
 const {id}=useParams();const {token}=useAuth();const nav=useNavigate();const [task,setTask]=useState(null);const [loading,setLoading]=useState(true);const [submitting,setSubmitting]=useState(false);const [error,setError]=useState('')
 const load=useCallback(async()=>{setLoading(true);setError('');try{const d=await getTask(token,id);setTask(d.task)}catch(e){setError(e.message)}finally{setLoading(false)}},[token,id])
 useEffect(()=>{load()},[load])
 async function submit(values){setError('');setSubmitting(true);try{await updateTask(token,id,values);nav(`/tasks/${id}`)}catch(e){setError(e.message)}finally{setSubmitting(false)}}
 if(loading)return <LoadingState label="Loading task for editing..."/>;if(error&&!task)return <ErrorState message={error} onRetry={load}/>
 return <section className="form-page"><Link className="back-link" to={`/tasks/${id}`}>← Back to task</Link><div className="page-heading compact"><div><span className="eyebrow">Edit task</span><h1>Update task</h1><p className="muted">Change the task details and save your updates.</p></div></div>{error&&<div className="alert" role="alert">{error}</div>}<TaskForm initialTask={task} submitLabel="Save Changes" onSubmit={submit} submitting={submitting}/></section>
}
