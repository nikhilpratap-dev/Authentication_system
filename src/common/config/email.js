import nodemailer from "nodemailer";

//SMTP TRANSPORTER
const transport = nodemailer.createTransport({
  host: (process.env.SMTP_HOST),
  port: Number(process.env.SMTP_PORT) ||2525,
  auth: {
    user: (process.env.SMTP_USER),
    pass: (process.env.SMTP_PASS)
  }
});


const sendEmail = async (to, subject, html)=>{
     await transport.sendMail({
      from:`${process.env.SMTP_FROM_USER}<${process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject,
      html,
     });
};


const verificationEmail= async (email, token)=>{
  // const url = `${process.env.CLIENT_URL} click here <${token}>`;
  const url = `${process.env.CLIENT_URL}/verify-email/${token}`;

  await sendEmail(email,
    "verify your email",
    `<h2>Welcome!</h2><p>Click <a href="${url}">here</a> to verify your email.</p>`,
  )
};

const sendResetPasswordEmail = async (email, token) => {
  const url = `${process.env.CLIENT_URL}/reset-password/${token}`;
  await sendEmail(
    email,
    "Reset your password",
    `<h2>Password Reset</h2><p>Click <a href="${url}">here</a> to reset your password. This link expires in 15 minutes.</p>`,
  );
};

export {verificationEmail,
  sendEmail,
  sendResetPasswordEmail,
}