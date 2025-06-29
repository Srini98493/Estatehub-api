const createBookingSuccessEmail = (userName, propertyDetails) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Successful</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: auto;
            background: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .logo {
            text-align: center;
            margin-bottom: 20px;
        }
        h1 {
            color: #333;
            font-size: 24px;
            font-weight: bold;
            text-align: center;
        }
        p {
            color: #555;
            font-size: 14px;
            text-align: center;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #999;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">87f5
            <img src="https://usc1.contabostorage.com/060e835992534d1face309804cd35474:ehub-dev/properties/3235-357e-4ea6-9b54-6779a811ea62_logo_4.png" alt="EstateHub Logo" style="max-width: 150px;">
        </div>
        <h1>Your Booking Was Successful!</h1>
        <p>Thank you for booking with us. Your reservation details are as follows:</p>
        <p style="font-size: 12px;">[Booking Details]</p>
        <p>We look forward to serving you!</p>
        <p class="footer">Best regards,<br>EstateHub</p>
    </div>
</body>
</html>
        `;
};

module.exports = {
  createBookingSuccessEmail,
};
