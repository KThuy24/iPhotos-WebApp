const jwt = require("jsonwebtoken");

// hàm xác thực người dùng
exports.authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json("Token đã hết hạn");
        }
        req.user = decoded;
        next();
      });
    } else {
      return res.status(401).json("Người dùng chưa được xác thực");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Lỗi xác thực người dùng" });
  }
};

// hàm phân quyền 
exports.authorize = (role) => (req, res, next) => {
  this.authenticate(req, res, () => {
    if (!role.includes(req.user.role)) {
      return res.status(404).json({ message: "Quyền truy cập bị từ chối" }); // báo lỗi
    } else {
      next();
    }
  });
};