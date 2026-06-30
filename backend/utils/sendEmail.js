import nodemailer from 'nodemailer';
import config from '../config/config.js';

const createTransporter = () => {
  if (config.email.host && config.email.user && config.email.pass) {
    return nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.port === 465,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  }

  return nodemailer.createTransport({
    jsonTransport: true,
  });
};

export const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"${config.email.fromName}" <${config.email.fromEmail}>`,
    to,
    subject,
    html,
    text,
  };

  const info = await transporter.sendMail(mailOptions);

  if (config.nodeEnv === 'development' && !config.email.host) {
    console.log('Email preview (dev mode):', info.message || info);
  }

  return info;
};

export const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${config.clientUrl}/reset-password/${resetToken}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #6366f1;">Royal Task Manager</h2>
      <p>Hello ${user.name},</p>
      <p>You requested a password reset. Click the button below to reset your password:</p>
      <a href="${resetUrl}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">Reset Password</a>
      <p>This link expires in 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    </div>
  `;

  const text = `Reset your password: ${resetUrl}. This link expires in 10 minutes.`;

  return sendEmail({
    to: user.email,
    subject: 'Password Reset - Royal Task Manager',
    html,
    text,
  });
};
