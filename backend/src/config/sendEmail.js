const nodemailer = require('nodemailer');

//-------------------------------SEND EMAIL FORGOTPASSWORD----------------------------------------//
exports.sendEmail_ForgotPassword = async (to, resetLink) => {
    const transporter = nodemailer.createTransport({
      // Cấu hình Nodemailer
      service: "gmail",
      auth: {
        user: process.env.MAIL_ACCOUNT,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  
    // Nội dung email
    const mailOptions = {
      from: process.env.MAIL_ACCOUNT,
      to,
      subject: "Khôi phục mật khẩu - [iPhotos]",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <h2 style="text-align: center; color: #333;">KHÔI PHỤC MẬT KHẨU</h2>
          <p style="text-align: center; font-size: 16px;">iPhotos WebApp</p>
          <p style="font-size: 15px; color: red;"><i>*Vui lòng truy cập vào đường Link dưới đây để thực hiện khôi phục mật khẩu !</i></p>
          <hr>
            <p style="font-size: 14px;">${resetLink}</p>
          <hr>
            <p style="text-align: center;">Cảm ơn người dùng đã sử dụng dịch vụ của <strong>iPhotos</strong>.</p>
            <p style="text-align: center;"><i>Trân trọng,</i><br><strong>Đội ngũ quản lý website</strong>.</p>
        </div>
      `,
    };
    try {
      await transporter.sendMail(mailOptions); // Gửi email
    } catch (err) {
      console.error("Lỗi khi gửi email:", err);
      throw new Error("Lỗi khi gửi email khôi phục mật khẩu");
    }
};