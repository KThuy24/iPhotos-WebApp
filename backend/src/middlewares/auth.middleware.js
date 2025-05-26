const jwt = require("jsonwebtoken");

// hàm xác thực người dùng
const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token; // lấy token từ cookie trong trình duyệt
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          return res.status(401).json("Token đã hết hạn");
        }
        req.data = user;
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
const authorize = (role) => (req, res, next) => {
  authenticate(req, res, () => {
    if (!role.includes(req.data.role)) {
      return res.status(404).json({ message: "Quyền truy cập bị từ chối" }); // báo lỗi
    } else {
      next();
    }
  });
};

module.exports = authenticate, authorize;