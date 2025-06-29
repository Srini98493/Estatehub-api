const createForgotPasswordEmailTemplate = (token, otp, config) => {
  const resetPasswordUrl = `${config.websiteurl}reset-password?token=${token}&otp=${otp}`;
  return `
  <!DOCTYPE html>
		<html>
		<head>
			<title>Reset Password</title>
			<style>
				.button {
					background-color: #0096c7; /* Green */
					border: none;
					color: white;
					padding: 15px 32px;
					text-align: center;
					text-decoration: none;
					display: inline-block;
					font-size: 16px;
					margin: 4px 2px;
					cursor: pointer;
					border-radius: 5px;
				}
			</style>
		</head>
		<body>
        <div class="header">
            <div style="display: flex; align-items: center; justify-content: center;">
                <!-- Logo -->
                <img src="https://usc1.contabostorage.com/060e835992534d1face309804cd35474:ehub-dev/properties/87f53235-357e-4ea6-9b54-6779a811ea62_logo_4.png" style="width: 100px; height: 100px;" alt="Logo">
            </div>
        </div>
			<p>Dear user,</p>
			<p>To reset your password, please click the button below:</p>
			<a href="${resetPasswordUrl}" class="button">Reset Password</a>
			<p>If you did not request any password resets, then ignore this email. Your token will be expired in 24 hours.</p>
		</body>
		</html>
  `;
};

module.exports = {
  createForgotPasswordEmailTemplate,
};
