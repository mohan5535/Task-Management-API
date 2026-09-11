const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database/database");

function register(req,res) {
  const {name,email,password} = req.body;
  if (!name || !email || !password) return res.status(400).json({success:false,message:"Name, email and password are required."});
  const normalizedEmail = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail))
    return res.status(400).json({success:false,message:"Please provide a valid email address."});
  if (password.length < 6)
    return res.status(400).json({success:false,message:"Password must be at least 6 characters long."});
  if (db.prepare("SELECT id FROM users WHERE email=?").get(normalizedEmail))
    return res.status(400).json({success:false,message:"An account with this email already exists."});
  const hash = bcrypt.hashSync(password,10);
  const result = db.prepare("INSERT INTO users(name,email,password) VALUES(?,?,?)").run(name.trim(),normalizedEmail,hash);
  return res.status(201).json({success:true,message:"User registered successfully.",user:{id:result.lastInsertRowid,name:name.trim(),email:normalizedEmail}});
}

function login(req,res) {
  const {email,password} = req.body;
  if (!email || !password) return res.status(400).json({success:false,message:"Email and password are required."});
  const user = db.prepare("SELECT * FROM users WHERE email=?").get(email.trim().toLowerCase());
  if (!user || !bcrypt.compareSync(password,user.password))
    return res.status(401).json({success:false,message:"Invalid email or password."});
  const token = jwt.sign({id:user.id,email:user.email},process.env.JWT_SECRET,{expiresIn:"1h"});
  return res.status(200).json({success:true,message:"Login successful.",token,user:{id:user.id,name:user.name,email:user.email}});
}
module.exports = {register,login};