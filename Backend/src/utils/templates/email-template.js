const verificationEmailTemplate = (name, verifyUrl) => {
    return `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #ffffff;">
    <h2 style="color: #1B2A4A; margin-bottom: 8px;">Welcome to Life-Link, ${name} 👋</h2>
    <p style="color: #444444; font-size: 15px; line-height: 1.5;">
      You're almost set. Verify your email address to activate your account and start connecting.
    </p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${verifyUrl}"
         style="background-color: #C0392B; color: #ffffff; text-decoration: none;
                padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: bold;
                display: inline-block;">
        Verify Email
      </a>
    </div>

    <p style="color: #777777; font-size: 13px;">
      This link expires in 24 hours. If you didn't create a Life-Link account, you can ignore this email.
    </p>

    <p style="color: #999999; font-size: 12px; margin-top: 24px;">
      Or copy this link into your browser:<br/>
      <span style="word-break: break-all;">${verifyUrl}</span>
    </p>
  </div>
  `;
};

export { verificationEmailTemplate };