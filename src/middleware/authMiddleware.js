const jwt = require("jsonwebtoken");
function authenticateToken(req,res,next) {
  const header = req.headers.authorization;
  const token = header && header.startsWith("Bearer ") ? header.split(" ")[1] : null;
  if (!token) return res.status(401).json({success:false,message:"Authentication token is required."});
  try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
  catch { return res.status(401).json({success:false,message:"Invalid or expired authentication token."}); }
}
module.exports = authenticateToken;