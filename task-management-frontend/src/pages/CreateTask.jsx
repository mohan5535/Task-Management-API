import {useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import {createTask} from '../services/api'
import {useAuth} from '../context/AuthContext'
import TaskForm from '../components/TaskForm'
export default function CreateTask(){
 const {token}=useAuth();const nav=useNavigate();const [error,setError]=useState('');const [submitting,setSubmitting]=useState(false)
 async function submit(values){setError('');setSubmitting(true);try{const d=await createTask(token,values);nav(`/tasks/${d.task.id}`)}catch(e){setError(e.message)}finally{setSubmitting(false)}}
 return <section className="form-page"><Link className="back-link" to="/tasks">← Back to tasks</Link><div className="page-heading compact"><div><span className="eyebrow">New task</span><h1>Create a task</h1><p className="muted">Add a task to your personal workspace.</p></div></div>{error&&<div className="alert" role="alert">{error}</div>}<TaskForm submitLabel="Create Task" onSubmit={submit} submitting={submitting}/></section>
}
