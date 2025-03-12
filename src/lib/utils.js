const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;
const node_mode = process.env.NODE_ENV;

const generateToken = (userId, res) => {
  //ต้องดีซักเจอริ่งก่อนใช้งาน
  const token = jwt.sign({ userId }, secret, { expiresIn: "1d" });
  res.cookie("jwt", token, {
    maxAge: 24 * 60 * 60 * 1000, //MS
    httpOnly: true, //XSS attack
    sameSite: "strict", //CSRF attack
    secure: node_mode !== "development",
  });

  console.log("Token generated");
  return token;
};

module.exports = { generateToken };
