const Account = require('../models/account.model.js');
const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken");
const { sendEmail_ForgotPassword } = require("../config/sendEmail.js"); 
const getDataUri = require("../config/dataUri.js");
const cloudinary = require("../config/cloudinary.js");
const defaultAvatar = require("../config/defaultAvatar.js");

// hàm đăng ký
const register = async (req, res) => {
  try {
    const { fullname, email, username, password, role} = req.body;

    // kiểm tra thông tin nhập, nếu thiếu thông tin sẽ thông báo
    if(!fullname || !email || !username || !password){
      return res.status(404).json({ 
        success: false,
        message: "Vui lòng nhập đầy đủ thông tin !"
      });      
    }
    // kiểm tra tài khoản có tồn tại hay chưa
    const existingEmail = await Account.findOne({ email });

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
    const newAccount = new Account({
      fullname,
      email,
      username,
      password: hashedPassword,
      avatar: defaultAvatar[Role],
      role: Role,
    });

    // lưu tài khoản mới vào Account
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
      message: "Lỗi đăng ký, vui lòng kiểm tra lại Server !", 
      error 
    });
    console.log(error);
  }
};

// hàm đăng nhập
const login = async (req, res) => {
  try{
    const { EmailorUsername, password } = req.body;

    // kiểm tra thông tin nhập, nếu thiếu thông tin sẽ thông báo
    if (!EmailorUsername || !password) {
      return res.status(404).json({
        success: false,
        message: "Vui lòng nhập email hoặc username và mật khẩu !"
      });
    }

    // kiểm tra email hoặc mật khẩu, nếu không tồn tại sẽ thông báo
    const account = await Account.findOne({ 
      $or: [
        { email: EmailorUsername },
        { username: EmailorUsername }
      ].filter(Boolean) // loại bỏ null nếu thiếu
    });
    // kiểm tra sự tồn tại
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
        { id: account._id, role: account.role },
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
    res.status(500).json({ 
      success: false,
      message: "Lỗi đăng nhập, vui lòng kiểm tra lại Server !", 
      error 
    });
    console.log(error);
  }
};

// hàm đăng xuất
const logout = async (req, res) => {
  try {
    res.clearCookie("token");

    return res.status(200).json({ 
      success: true,
      message: "Đăng xuất thành công !" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Lỗi đăng xuất, vui lòng kiểm tra lại Server !",
      error 
    });
    console.log(error);
  }
};

// hàm quên mật khẩu
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // kiểm tra thông tin nhập, nếu thiếu sẽ thông báo
    if (!email){
      return res.status(404).json({ 
        success: false,
        message: "Vui lòng nhập email !" 
      });
    }

    // kiểm tra email, nếu không tồn tại sẽ thông báo
    const account = await Account.findOne({ email });
    if (!account){
      return res.status(404).json({ 
        success: false, message: "Email này không tồn tại !" 
      });
    }
    
    // cấp token mới để khôi phục mật khẩu có thời hạn 1 giờ
    const resetToken = jwt.sign({ id: account._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    await Account.findByIdAndUpdate(
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
    return res.status(200).json({ 
      success: true,
      message: "Yêu cầu khôi phục mật khẩu thành công, vui lòng kiểm trả Email !" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Lỗi gửi email khôi phục mật khẩu, vui lòng kiểm tra lại Server !", 
      error 
    });
    console.log(error);
  }
};

// hàm khôi phục mật khẩu
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // giải mã token khôi phục mật khẩu
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const account = await Account.findById({
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
    
    // trả về kết quả
    return res.status(200).json({ 
      success: true,
      message: "Khôi phục mật khẩu thành công !", 
      notification: "Hệ thống sẽ chuyển sang trang đăng nhập sau ít giây nữa"
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Lỗi đặt lại mật khẩu, vui lòng kiểm tra lại Server !", 
      error 
    });
    console.log(error);
  }
};
  
// hàm cập nhật thông tin tài khoản
const updateAccount = async (req, res) => {
  try {
    const { fullname, email, username, role, activation } = req.body;
    const accountId = req.params.id;

    // kiểm tra đã đăng nhập hay chưa
    if (!accountId) {
      return res.status(404).json({ 
        success: false,
        message: "Không tìm thấy thông tin tài khoản !" 
      });
    }

    const file = req.file;
    let userURL = null;

    // kiểm tra sự tồn tại
    const existingAccount = await Account.findById(accountId);
    if (!existingAccount) {
      return res.status(404).json({ message: "Tài khoản không tồn tại!" });
    }

    if (file) {
      const fileUri = getDataUri(file);

      // Xóa ảnh cũ nếu có
      const oldAvatar = existingAccount.avatar?.[0];
      if (oldAvatar) {
        const publicId = oldAvatar.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`${publicId}`);
      }

      // Upload ảnh mới
      const uploadResponse = await cloudinary.uploader.upload(fileUri.content);
      if (uploadResponse) {
        userURL = uploadResponse.secure_url;
      }
    }

    const updatedAvatar = userURL ? [userURL] : existingAccount.avatar;

    // cập nhật thông tin tài khoản
    const data = await Account.findByIdAndUpdate(
      accountId,
      {
        fullname,
        email,
        username,
        avatar: updatedAvatar,
        role,
        activation
      },
      { new: true }
    ).select("-password");

    // trả về kết quả
    return res.status(200).json({
      message: "Cập nhật hồ sơ thành công !",
      data
    });
  } catch(error){
    res.status(500).json({ message: "Lỗi cập nhật thông tin tài khoản, vui lòng kiểm tra lại Server !", error });
    console.log(error);
  }
};

// hàm xóa tài khoản
const deleteAccount = async (req, res) => {
  try{
    // kiểm tra sự tồn tại
    const account = await Account.findById(req.params.id);
    if(!account){
      return res.status(404).json({
        success: false,
        message: "Tài khoản không tồn tại !"
      })
    }
    // kiểm tra xem có xóa tài khoản thành công hay không
    const deleteAccount = await Account.findByIdAndDelete(req.params.id);
    if(!deleteAccount){
      return res.status(404).json({
        success: false,
        message: "Xóa tài khoản không tồn tại !"
      })
    }
    // trả về kết quả
    return res.status(200).json({
      success: true,
      message: "Xóa tài khoản thành công !",
    })
  }catch(error){
    res.status(500).json({ 
      success: false,
      message: "Lỗi xóa tài khoản, vui lòng kiểm tra lại Server !", 
      error 
    });
    console.log(error);
  }
};

// hàm lấy danh sách tài khoản
const allAccount = async(req, res) => {
  try{
    const accounts = await Account.find().select("-password").sort({ createAt: -1}); // lấy danh sách tài khoản trừ mật khẩu và sx giảm dần
    
    // kiểm tra danh sách nếu rỗng sẽ thông báo
    if(!accounts){
      return res.status(404).json({
        success: false,
        message: "Danh sách rỗng !"
      })
    };

    // trả về kết quả
    return res.status(200).json({
      success: true,
      message: "Lấy danh sách tài khoản thành công !",
      accounts
    });
  } catch(error){
    res.status(500).json({ message: "Lỗi lấy danh sách tài khoản, vui lòng kiểm tra lại Server !", error });
    console.log(error);
  }
};

// hàm lấy thông tin chi tiết tài khoản
const detailAccount = async(req, res) => {
  try{
    const account = await Account.findById(req.params.id).select("-password"); // lấy thông tin chi tiết trừ mật khẩu
    // kiểm tra sự tồn tại
    if(!account){
      return res.status(404).json({
        success: false,
        message: "Tài khoản không tồn tại !"
      })
    };

    // trả về kết quả
    return res.status(200).json({
      success: true,
      message: "Lấy thông tin chi tiết tài khoản thành công",
      account
    });
  } catch(error){
    res.status(500).json({ message: "Lỗi lấy thông tin chi tiết tài khoản, vui lòng kiểm tra lại Server !", error });
    console.log(error);
  }
};

module.exports = {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    updateAccount,
    deleteAccount,
    allAccount,
    detailAccount
};