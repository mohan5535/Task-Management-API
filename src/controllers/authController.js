const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../database/database");

async function register(req,res) {
  const {name,email,password} = req.body || {};
  if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string" || !name.trim() || !email.trim() || !password)
    return res.status(400).json({success:false,message:"Name, email and password are required."});
  const normalizedEmail = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail))
    return res.status(400).json({success:false,message:"Please provide a valid email address."});
  if (name.trim().length < 2)
    return res.status(400).json({success:false,message:"Name must be at least 2 characters long."});
  if (password.length < 6)
    return res.status(400).json({success:false,message:"Password must be at least 6 characters long."});
  const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [normalizedEmail]);
  if (existingUser.rowCount)
    return res.status(400).json({success:false,message:"An account with this email already exists."});
  const hash = bcrypt.hashSync(password,10);
  try {
    const result = await pool.query(
      "INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING id",
      [name.trim(), normalizedEmail, hash],
    );
    return res.status(201).json({success:true,message:"User registered successfully.",user:{id:result.rows[0].id,name:name.trim(),email:normalizedEmail}});
  } catch (error) {
    if (error.code === "23505") return res.status(400).json({success:false,message:"An account with this email already exists."});
    throw error;
  }
}

async function login(req,res) {
  const {email,password} = req.body || {};
  if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password)
    return res.status(400).json({success:false,message:"Email and password are required."});
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email.trim().toLowerCase()]);
  const user = result.rows[0];
  if (!user || !bcrypt.compareSync(password,user.password))
    return res.status(401).json({success:false,message:"Invalid email or password."});
  const token = jwt.sign({id:user.id,email:user.email},process.env.JWT_SECRET,{expiresIn:"1h"});
  return res.status(200).json({success:true,message:"Login successful.",token,user:{id:user.id,name:user.name,email:user.email}});
}
module.exports = {register,login};