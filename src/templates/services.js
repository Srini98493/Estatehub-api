const createServiceRequestEmail = (
  userName,
  userEmail,
  userContact,
  requestDate,
  serviceRequested,
  config
) => {

   
        if (!config || !config.websitelogourl) {
            throw new Error("Missing required 'websitelogourl' in config object.");
        }
    
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NRI Service Request Notification</title>
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
        .service-request {
            margin-top: 15px;
            margin-bottom: 15px;
        }
        .service-request p {
            margin: 5px 0;
            font-size: 14px;
        }
        .service-request span.first {
            font-weight: normal;
        }
        .service-request span.second {
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
        <p>We have received a new service request from a user. Below are the details:</p>
        
        <!-- Service Request Details Section -->
        <div class="service-request">
            <p><span class="first">Inquired By:</span> <span class="second">${userName}</span></p>
            <p><span class="first">Email:</span> <span class="second">${userEmail}</span></p>
            <p><span class="first">Contact:</span> <span class="second">${userContact}</span></p>
            <p><span class="first">Service Requested:</span> <span class="second">${serviceRequested}</span></p>
            <p><span class="first">Inquire Date:</span> <span class="second">${requestDate}</span></p>
        </div>

        <p>Kindly review the request and take necessary actions as per your standard process.</p>

        <p>If you have any questions or need further details, please feel free to contact the requester directly via the contact information provided above.</p>

        <!-- Button to View the Service Request -->
        <a href="${config.websiteurl}" class="view-button">
            View NRI Service Request
        </a>

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

module.exports = createServiceRequestEmail;
