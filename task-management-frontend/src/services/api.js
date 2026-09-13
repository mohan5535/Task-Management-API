const API_URL=(import.meta.env.VITE_API_URL||'http://localhost:3000/api').replace(/\/$/,'')
async function request(path,options={}){
 let response
 try {
  response=await fetch(`${API_URL}${path}`,{...options,headers:{'Content-Type':'application/json',...(options.headers||{})}})
 } catch {
  throw new Error('Unable to reach the API. Make sure the backend server is running.')
 }
 const data=await response.json().catch(()=>({}))
 if(!response.ok) throw new Error(data.message||'Request failed. Please try again.')
 return data
}
export const registerUser=(body)=>request('/auth/register',{method:'POST',body:JSON.stringify(body)})
export const loginUser=(body)=>request('/auth/login',{method:'POST',body:JSON.stringify(body)})
const auth=(token)=>({Authorization:`Bearer ${token}`})
export const getTasks=(token)=>request('/tasks',{headers:auth(token)})
export const getTask=(token,id)=>request(`/tasks/${id}`,{headers:auth(token)})
export const createTask=(token,body)=>request('/tasks',{method:'POST',headers:auth(token),body:JSON.stringify(body)})
export const updateTask=(token,id,body)=>request(`/tasks/${id}`,{method:'PUT',headers:auth(token),body:JSON.stringify(body)})
export const deleteTask=(token,id)=>request(`/tasks/${id}`,{method:'DELETE',headers:auth(token)})
