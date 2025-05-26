const admin = require('../config/firebase');

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token bị thiếu hoặc không hợp lệ' });
    }
  
    const idToken = authHeader.split(' ')[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req.user = decodedToken; // chứa uid, email, name, v.v.
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
    }
};
  
module.exports = verifyToken;