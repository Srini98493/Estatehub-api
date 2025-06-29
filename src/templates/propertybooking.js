const createPropertyBookingEmail = (propertyDetails, config) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Property Booking Notification</title>
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
        .property-details {
            margin-top: 15px;
            margin-bottom: 15px;
        }
        .property-details p {
            margin: 5px 0;
            font-size: 14px;
        }
        .property-details span.first {
            font-weight: normal;
        }
        .property-details span.second {
            font-weight: bold;
        }
        .steps ul {
            padding-left: 20px;
        }
        .steps li {
            font-size: 14px;
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
            <img src="https://usc1.contabostorage.com/060e835992534d1face309804cd35474:ehub-dev/properties/87f53235-357e-4ea6-9b54-6779a811ea62_logo_4.png" alt="Estate Hub Logo">
        </div>
    </div>

    <div class="content">
        <p>Dear Admin,</p>       
        <p>We are excited to inform you that a buyer/tenant has successfully booked your property on EstateHub. Below are the details of the booking:</p>
        
        <!-- Property Details Section -->
        <div class="property-details">
            <p><span class="first">Title:</span> <span class="second">${propertyDetails.propertytitle}</span></p>
            <p><span class="first">Category:</span> <span class="second">${propertyDetails.categoryDetails?.categoryname} - ${propertyDetails.categoryDetails?.categorytype}</span></p>
            <p><span class="first">Location:</span> <span class="second">${propertyDetails.location}</span></p>
            <p><span class="first">Booked By:</span> <span class="second">${propertyDetails.buyerfullname}</span></p>
			<p><span class="first">Booked Email:</span> <span class="second">${propertyDetails.buyeremail}</span></p>
			<p><span class="first">Booked Contact:</span> <span class="second">${propertyDetails.buyercontact}</span></p>
            <p><span class="first">Booking Date:</span> <span class="second">${propertyDetails.buyerbookeddt}</span></p>
        </div>

        <p>The next steps will include:</p>
        <div class="steps">
            <ul>
                <li>Finalizing the booking process</li>
                <li>Scheduling a meeting with the buyer/tenant</li>
                <li>Preparing the necessary documentation</li>
            </ul>
        </div>

        <p>If you have any questions or need further assistance, feel free to contact us at <a href="mailto:support@estateshub.co.in">support@estateshub.co.in</a>.</p>
        <p>Thank you for using EstateHub!</p>

        <br>

        <!-- View the Property Button -->
        <a href="${config.websiteurl}" class="view-button">
            View the Property
        </a>

        <br><br>
        <div class="footer">
            <p>Best regards,</p>
            <p><strong>The EstateHub Team</strong><br>
               <a href="mailto:support@estateshub.co.in">support@estateshub.co.in</a><br>
               <!--<strong>Website:</strong> <a href="http://www.estatehub4u.com">www.estatehub4u.com</a> -->
            </p>
        </div>
    </div>

</body>
</html>`;
};

module.exports = createPropertyBookingEmail;
