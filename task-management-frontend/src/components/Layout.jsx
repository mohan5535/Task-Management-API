import {Link,NavLink,Outlet,useNavigate} from 'react-router-dom'
import {useAuth} from '../context/AuthContext'
export default function Layout(){
 const {isAuthenticated,logout}=useAuth();const navigate=useNavigate()
 const handleLogout=()=>{logout();navigate('/login')}
 return <div className="app-shell"><header className="navbar"><Link className="brand" to={isAuthenticated?'/tasks':'/login'}><span className="brand-mark">T</span><span>TaskFlow</span></Link>{isAuthenticated&&<nav className="nav-links"><NavLink to="/tasks">Tasks</NavLink><NavLink to="/tasks/new">New Task</NavLink><button className="nav-logout" onClick={handleLogout}>Logout</button></nav>}</header><main className="page-container"><Outlet/></main><footer className="footer"><span>TaskFlow</span><span>React + Node.js REST API</span></footer></div>
}
