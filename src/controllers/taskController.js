const { pool } = require("../database/database");
const statuses = ["pending","in-progress","completed"];

function taskId(value) {
  return /^\d+$/.test(value) && Number(value) > 0 ? Number(value) : null;
}

function validate(title,status) {
  if (typeof title !== "string" || !title.trim()) return "Title is required.";
  if (title.trim().length > 100) return "Title must be 100 characters or fewer.";
  if (status !== undefined && !statuses.includes(status)) return "Status must be pending, in-progress, or completed.";
  return null;
}
async function createTask(req,res) {
  const {title,description="",status="pending"} = req.body || {};
  const error = validate(title,status);
  if (error) return res.status(400).json({success:false,message:error});
  if (typeof description !== "string") return res.status(400).json({success:false,message:"Description must be a string."});
  if (description.length > 500) return res.status(400).json({success:false,message:"Description must be 500 characters or fewer."});
  const result = await pool.query(
    "INSERT INTO tasks(title, description, status, user_id) VALUES($1, $2, $3, $4) RETURNING *",
    [title.trim(), description.trim(), status, req.user.id],
  );
  const task = result.rows[0];
  return res.status(201).json({success:true,message:"Task created successfully.",task});
}
async function getTasks(req,res) {
  const result = await pool.query("SELECT * FROM tasks WHERE user_id = $1 ORDER BY id DESC", [req.user.id]);
  const tasks = result.rows;
  return res.status(200).json({success:true,count:tasks.length,tasks});
}
async function getTask(req,res) {
  const id = taskId(req.params.id);
  if (!id) return res.status(400).json({success:false,message:"Task id must be a positive integer."});
  const result = await pool.query("SELECT * FROM tasks WHERE id = $1 AND user_id = $2", [id, req.user.id]);
  const task = result.rows[0];
  if (!task) return res.status(404).json({success:false,message:"Task not found."});
  return res.status(200).json({success:true,task});
}
async function updateTask(req,res) {
  const {title,description,status} = req.body || {};
  if (title===undefined && description===undefined && status===undefined)
    return res.status(400).json({success:false,message:"Provide at least one field to update."});
  const id = taskId(req.params.id);
  if (!id) return res.status(400).json({success:false,message:"Task id must be a positive integer."});
  const oldResult = await pool.query("SELECT * FROM tasks WHERE id = $1 AND user_id = $2", [id, req.user.id]);
  const old = oldResult.rows[0];
  if (!old) return res.status(404).json({success:false,message:"Task not found."});
  const nextTitle = title===undefined ? old.title : title;
  const nextDescription = description===undefined ? old.description : description;
  const nextStatus = status===undefined ? old.status : status;
  const error = validate(nextTitle,nextStatus);
  if (error) return res.status(400).json({success:false,message:error});
  if (typeof nextDescription !== "string") return res.status(400).json({success:false,message:"Description must be a string."});
  if (nextDescription.length > 500) return res.status(400).json({success:false,message:"Description must be 500 characters or fewer."});
  const result = await pool.query(
    "UPDATE tasks SET title = $1, description = $2, status = $3, updated_at = NOW() WHERE id = $4 AND user_id = $5 RETURNING *",
    [nextTitle.trim(), nextDescription.trim(), nextStatus, id, req.user.id],
  );
  const task = result.rows[0];
  return res.status(200).json({success:true,message:"Task updated successfully.",task});
}
async function deleteTask(req,res) {
  const id = taskId(req.params.id);
  if (!id) return res.status(400).json({success:false,message:"Task id must be a positive integer."});
  const result = await pool.query("DELETE FROM tasks WHERE id = $1 AND user_id = $2", [id, req.user.id]);
  if (!result.rowCount) return res.status(404).json({success:false,message:"Task not found."});
  return res.status(200).json({success:true,message:"Task deleted successfully."});
}
module.exports = {createTask,getTasks,getTask,updateTask,deleteTask};