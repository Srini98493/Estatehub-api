const createApplyLoanEmail = (userName, userEmail, userContact, requestDate) => {           
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bank Loan Service Request Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
        }
        .header {
            background-color: #F5F7FA;
            padding: 10px;
            text-align: center;
            color: white;
            font-size: 18px;
        }
        .header img {
            max-width: 120px;
            height: auto;
            margin-right: 10px;
        }
        .header h4 {
            color: #000;
            margin: 0;
        }
        .content {
            padding: 20px;
            background-color: #ffffff;
        }
        .loan-request {
            margin-top: 15px;
            margin-bottom: 15px;
        }
        .loan-request p {
            margin: 5px 0;
            font-size: 14px;
        }
        .loan-request span.first {
            font-weight: normal;
        }
        .loan-request span.second {
            font-weight: bold;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
        }
        /* Button Styling */
        .view-button {
            display: inline-block;
            background-color: #0096c7;
            color: white;
            padding: 10px 20px;
            font-size: 16px;
            text-align: center;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
        .view-button:hover {
            background-color: #0096c7;
        }
    </style>
</head>
<body>

    <div class="header">
        <div style="display: flex; align-items: center; justify-content: center;">
            <!-- Logo -->
            <img src="https://usc1.contabostorage.com/060e835992534d1face309804cd35474:ehub-dev/properties/87f53235-357e-4ea6-9b54-6779a811ea62_logo_4.png" alt="Logo">
            <!-- Text Next to Logo -->
            <h4>Estate Hub</h4>
        </div>
    </div>

    <div class="content">
        <p>Dear Admin,</p>
        <p>We have received a new request for the Bank Loan Service. Below are the details:</p>
        
        <!-- Bank Loan Service Request Details Section -->
        <div class="loan-request">
            <p><span class="first">Inquired By:</span> <span class="second">${userName}</span></p>
            <p><span class="first">Requester Email:</span> <span class="second">${userEmail}</span></p>
            <p><span class="first">Requester Contact:</span> <span class="second">${userContact}</span></p>            
            <p><span class="first">Request Date:</span> <span class="second">${requestDate}</span></p>
        </div>

        <p>Kindly review the request and proceed with the necessary steps to evaluate the loan application.</p>

        <p>If you have any questions or need further details, please feel free to contact the requester directly via the contact information provided above.</p>

        <br><br>

        <div class="footer">
            <p>Best regards,</p>
            <p><strong>The EstateHub Team</strong><br>
               <a href="mailto:support@estateshub.co.in">support@estateshub.co.in</a><br>
            </p>
        </div>
    </div>

</body>
</html>`;
};

module.exports = createApplyLoanEmail;
