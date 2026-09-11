const db = require("../database/database");
const statuses = ["pending","in-progress","completed"];

function validate(title,status) {
  if (!title || typeof title !== "string" || !title.trim()) return "Title is required.";
  if (title.trim().length > 100) return "Title must be 100 characters or fewer.";
  if (status !== undefined && !statuses.includes(status)) return "Status must be pending, in-progress, or completed.";
  return null;
}
function createTask(req,res) {
  const {title,description="",status="pending"} = req.body;
  const error = validate(title,status);
  if (error) return res.status(400).json({success:false,message:error});
  if (typeof description !== "string") return res.status(400).json({success:false,message:"Description must be a string."});
  const r = db.prepare("INSERT INTO tasks(title,description,status,user_id) VALUES(?,?,?,?)").run(title.trim(),description.trim(),status,req.user.id);
  const task = db.prepare("SELECT * FROM tasks WHERE id=? AND user_id=?").get(r.lastInsertRowid,req.user.id);
  return res.status(201).json({success:true,message:"Task created successfully.",task});
}
function getTasks(req,res) {
  const tasks = db.prepare("SELECT * FROM tasks WHERE user_id=? ORDER BY id DESC").all(req.user.id);
  return res.status(200).json({success:true,count:tasks.length,tasks});
}
function getTask(req,res) {
  const task = db.prepare("SELECT * FROM tasks WHERE id=? AND user_id=?").get(req.params.id,req.user.id);
  if (!task) return res.status(404).json({success:false,message:"Task not found."});
  return res.status(200).json({success:true,task});
}
function updateTask(req,res) {
  const {title,description,status} = req.body;
  if (title===undefined && description===undefined && status===undefined)
    return res.status(400).json({success:false,message:"Provide at least one field to update."});
  const old = db.prepare("SELECT * FROM tasks WHERE id=? AND user_id=?").get(req.params.id,req.user.id);
  if (!old) return res.status(404).json({success:false,message:"Task not found."});
  const nextTitle = title===undefined ? old.title : title;
  const nextDescription = description===undefined ? old.description : description;
  const nextStatus = status===undefined ? old.status : status;
  const error = validate(nextTitle,nextStatus);
  if (error) return res.status(400).json({success:false,message:error});
  if (typeof nextDescription !== "string") return res.status(400).json({success:false,message:"Description must be a string."});
  db.prepare("UPDATE tasks SET title=?,description=?,status=?,updated_at=CURRENT_TIMESTAMP WHERE id=? AND user_id=?")
    .run(nextTitle.trim(),nextDescription.trim(),nextStatus,req.params.id,req.user.id);
  const task = db.prepare("SELECT * FROM tasks WHERE id=? AND user_id=?").get(req.params.id,req.user.id);
  return res.status(200).json({success:true,message:"Task updated successfully.",task});
}
function deleteTask(req,res) {
  const r = db.prepare("DELETE FROM tasks WHERE id=? AND user_id=?").run(req.params.id,req.user.id);
  if (!r.changes) return res.status(404).json({success:false,message:"Task not found."});
  return res.status(200).json({success:true,message:"Task deleted successfully."});
}
module.exports = {createTask,getTasks,getTask,updateTask,deleteTask};