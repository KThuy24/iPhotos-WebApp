const accountModel = require('../models/account.model');
const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken");
const defaultAvatar = require("../config/defaultAvatar");
const { sendEmail_ForgotPassword } = require("../config/sendEmail.js"); 

const register = async (req, res) => {
  const { fullname, email, username, password, role} = req.body;

  try {
    // kiểm tra thông tin nhập, nếu thiếu thông tin sẽ thông báo
    if(!fullname || !email || !username || !password){
      return res.status(404).json({ 
        success: false,
        message: "Vui lòng nhập đầy đủ thông tin !"
      });      
    }
    // kiểm tra tài khoản có tồn tại hay chưa
    const existingEmail = await accountModel.findOne({ email });
    // thông báo email đã tồn tại
    if (existingEmail){
      return res.status(404).json({ 
        success: false,
        message: "Email này đã tồn tại !" 
      });
    }

    // mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const Role = role === "admin" ? role : "user";

    // tạo tài khoản
    const newAccount = new accountModel({
      fullname,
      email,
      username,
      password: hashedPassword,
      avatar: defaultAvatar[Role],
      role: Role,
    });
    // lưu tài khoản mới vào accountModel
    await newAccount.save();

    // trả về kết quả
    return res.status(200).json({
      success: true,
      message: "Đăng ký tài khoản thành công !",
      data: {
        id: newAccount._id,
        fullname: newAccount.fullname,
        email: newAccount.email,
        username: newAccount.username,
        avatar: newAccount.avatar,
        role: newAccount.role,
      }
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Lỗi đăng ký, vui lòng kiểm tra lại Server !", error 
    });
    console.log(error);
  }
};
  
const login = async (req, res) => {
  const { email, username, password } = req.body;
  try{
    // kiểm tra thông tin nhập, nếu thiếu thông tin sẽ thông báo
    if ((!email && !username) || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập email hoặc username và mật khẩu !"
      });
    }

    // kiểm tra email hoặc mật khẩu, nếu không tồn tại sẽ thông báo
    const account = await accountModel.findOne({ 
      $or: [
        email ? { email: email } : null,
        username ? { username: username } : null
      ].filter(Boolean) // loại bỏ null nếu thiếu
    });

    if (!account) {
      return res.status(404).json({ 
        success: false, 
        message: "Tài khoản không tồn tại !"
      });
    }

    // kiểm tra mật khẩu, nếu không đúng sẽ thông báo
    const isPassword = await bcrypt.compare(password, account.password);
    if (!isPassword) {
      return res.status(404).json({ 
        success: false, 
        message: "Mật khẩu không chính xác !" 
      });
    }

    if(account && isPassword){
      // tạo access token với hạn là 1 ngày
      const accessToken = jwt.sign(
        { accountId: account._id, role: account.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      // Lưu accessToken vào cookie
      res.cookie("token", accessToken, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        path: "/",
        sameSite: "strict",
      });

      // trả về kết quả
      return res.status(200).json({
        success: true,
        notification: "Đăng nhập thành công !, ",
        message: `Xin Chào ${account.fullname}`,
        data: {
          _id: account._id,
          fullname: account.fullname,
          email: account.email,
          username: account.username,
          avatar: account.avatar,
          role: account.role,
          activation: account.activation,
          token: accessToken
        },
      });
    }
  }catch(error){
    res.status(500).json({ message: "Lỗi đăng nhập, vui lòng kiểm tra lại Server !", error });
    console.log(error);
  }
};
  
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // kiểm tra thông tin nhập, nếu thiếu sẽ thông báo
    if (!email){
      return res.status(404).json({ 
        success: false,
        message: "Vui lòng nhập email !" 
      });
    }

    // kiểm tra email, nếu không tồn tại sẽ thông báo
    const account = await accountModel.findOne({ email });
    if (!account){
      return res.status(404).json({ 
        success: false, message: "Email này không tồn tại !" 
      });
    }
    
    // cấp token mới để khôi phục mật khẩu có thời hạn 1 giờ
    const resetToken = jwt.sign({ id: account._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    await accountModel.findByIdAndUpdate(
      account._id,
      {
        resetToken: resetToken,
        resetTokenExpire: Date.now() + 3600000, // Token hết hạn sau 1 giờ
      },
      { new: true }
    );
    
    // tạo link dẫn đến trang khôi phục mật khẩu
    const resetLink = `${process.env.CLIENT_URL}/reset-password/?token=${resetToken}`;
    
    // Gửi mail khôi phục mật khẩu cho người dùng
    await sendEmail_ForgotPassword(account.email, resetLink);
    
    // trả về kết quả
    return res.status(200).json({ message: "Yêu cầu khôi phục mật khẩu thành công, vui lòng kiểm trả Email !" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi gửi email khôi phục mật khẩu, vui lòng kiểm tra lại Server !", error });
    console.log(error);
  }
};
  
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // giải mã token khôi phục mật khẩu
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const account = await accountModel.findById({
      _id: decoded.id,
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    // kiểm tra token, nếu hết hạn sẽ thông báo
    if (!account) return res.status(404).json({
      success: false,
      message: "Token đã hết hạn !" 
    });

    // mã hóa mật khẩu mới sau đó lưu vào dữ liệu
    const passwordNew = await bcrypt.hash(password, 10);
    account.password = passwordNew;
    account.resetToken = undefined; // xóa token (dùng để đặt lại mật khẩu) trong CSDL
    account.resetTokenExpire = undefined; // xóa thời gian tồn tại của token (dùng để đặt lại mật khẩu) trong CSDL

    await account.save();

    return res.status(200).json({ 
      message: "Khôi phục mật khẩu thành công !", 
      notification: "Hệ thống sẽ chuyển sang trang đăng nhập sau ít giây nữa"
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi đặt lại mật khẩu, vui lòng kiểm tra lại Server !", error });
    console.log(error);
  }
};
  
module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword,
};