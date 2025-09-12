const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing or malformed",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data to req.user
    req.user = {
      id: verifiedToken.id,     // make sure you used `id` while signing token
      role: verifiedToken.role,
      email: verifiedToken.email,
    };

    next();
  } catch (err) {
    console.error("JWT verification error:", err.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = auth;
