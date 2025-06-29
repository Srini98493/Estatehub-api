const createPropertyReviewEmailTemplate = (property, config) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Property Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
        }
        .header {
            text-align: center;
            padding: 20px 0;
        }
        .header h1 {
            color: #1a1a1a;
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px 0;
        }
        .property-details {
            margin: 20px 0;
        }
        .property-details p {
            margin: 5px 0;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #0096c7;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            margin: 20px 0;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }
        .social-links {
            margin: 20px 0;
        }
        .social-links a {
            margin: 0 10px;
            text-decoration: none;
            color: #666;
        }
        .disclaimer {
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div style="display: flex; align-items: center; justify-content: center;">
                <!-- Logo -->
                <img src="https://usc1.contabostorage.com/060e835992534d1face309804cd35474:ehub-dev/properties/87f53235-357e-4ea6-9b54-6779a811ea62_logo_4.png" style="width: 100px; height: 100px;" alt="Estate Hub Logo">
            </div>
        </div>
        <div class="content">
            <h2>🏠 New Property Posted for Your Review</h2>
            
            <p>Hi Admin,</p>
            
            <p>A new property has been submitted by <strong>${property.fullname}</strong> and is now awaiting your approval.</p>
            
            <div class="property-details">                
                
            
                <p><strong>Title:</strong> ${property.propertytitle}</p>
                <p><strong>Location:</strong> ${property.location}</p>
                <p><strong>Price:</strong> ${property.price}</p>
                <p><strong>Category:</strong> ${property.categoryDetails?.categoryname} - ${property.categoryDetails?.categorytype}</p>
                <p><strong>Owner Email:</strong> ${property.email}</p>
                <p><strong>Owner Contact:</strong> ${property.contact}</p>
                </div>
            
            <p>You can review the details and approve or reject the property by visiting the admin panel.</p>
            
            <a href="${config.websiteurl}" class="button">Review Property</a>
        </div>
        
        <div class="footer">
            <p>Best regards,<br>EstateHub</p>
            
            
            <p class="disclaimer">
                Didn't initiate this action? Please report <a href="#">here</a> and we'll be happy to sort things quickly.
            </p>
        </div>
    </div>
</body>
</html>
`;
};

module.exports = { createPropertyReviewEmailTemplate };
