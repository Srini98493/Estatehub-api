const createOTPEmailTemplate = (otp) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Estate Hub - Email Verification</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .email-wrapper {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .logo {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo h1 {
            color: #2c3e50;
            margin: 0;
            font-size: 28px;
        }
        .content {
            text-align: center;
            color: #444444;
        }
        .otp-box {
            background-color: #f8f9fa;
            border-radius: 5px;
            padding: 20px;
            margin: 20px 0;
            letter-spacing: 3px;
            font-size: 32px;
            font-weight: bold;
            color: #2c3e50;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #666666;
        }
        .warning {
            color: #e74c3c;
            font-size: 14px;
            margin-top: 20px;
        }
        @media only screen and (max-width: 600px) {
            .container {
                padding: 10px;
            }
            .email-wrapper {
                padding: 20px;
            }
            .otp-box {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="email-wrapper">
            <div class="logo">
                <img src="https://usc1.contabostorage.com/060e835992534d1face309804cd35474:ehub-dev/properties/87f53235-357e-4ea6-9b54-6779a811ea62_logo_4.png" style="width: 100px; height: 100px;" alt="Estate Hub Logo">
            </div>
            <div class="content">
                <h2>Verify Your Email</h2>
                <p>Thank you for registering with Estate Hub. Please use the following OTP to verify your email address:</p>
                <div class="otp-box">
                    ${otp}
                </div>
                <p>This OTP will expire in 10 minutes.</p>
                <p class="warning">Please do not share this OTP with anyone.</p>
            </div>
            <div class="footer">
                <p>This is an automated message, please do not reply.</p>
                <p>&copy; ${new Date().getFullYear()} Estate Hub. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
`;

module.exports = createOTPEmailTemplate; 