
const register = async (req, res) => {
    const { } = req.body;
  
    try {

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
};
  
const login = async (req, res) => {

};
  
const forgotPassword = async (req, res) => {
    const {  } = req.body;
  
    try {

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
};
  
const resetPassword = async (req, res) => {
    const { } = req.body;
  
    try {

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
};
  
module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword,
};