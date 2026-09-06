export function generateConfirmationEmail(firstName: string, confirmUrl: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirm Your Subscription</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
          background-color: #f8f9fa; 
          margin: 0; 
          padding: 0; 
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: #ffffff; 
          border-radius: 12px; 
          overflow: hidden; 
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          margin-top: 40px;
          margin-bottom: 40px;
        }
        .header { 
          background: #1A3C34; 
          padding: 30px 40px; 
          text-align: center; 
        }
        .header img { 
          max-height: 60px; 
          margin-bottom: 8px; 
        }
        .header h1 { 
          color: #ffffff; 
          font-size: 24px; 
          font-weight: 700; 
          margin: 0; 
          letter-spacing: -0.5px;
        }
        .content { 
          padding: 40px; 
          color: #1a1a1a; 
          line-height: 1.6; 
        }
        .content h2 { 
          color: #1A3C34; 
          font-size: 20px; 
          margin-top: 0; 
        }
        .content p { 
          font-size: 16px; 
          color: #4a4a4a; 
        }
        .button { 
          display: inline-block; 
          background: #E45B10; 
          color: #ffffff !important; 
          padding: 14px 32px; 
          border-radius: 8px; 
          text-decoration: none; 
          font-weight: 700; 
          font-size: 16px; 
          margin: 20px 0 10px; 
        }
        .button:hover { 
          background: #c94a0a; 
        }
        .footer { 
          padding: 24px 40px; 
          background: #f8f9fa; 
          text-align: center; 
          font-size: 14px; 
          color: #888; 
          border-top: 1px solid #eaeaea;
        }
        .footer a { 
          color: #E45B10; 
          text-decoration: none; 
        }
        .allergen-note {
          background: #FFF4ED;
          border-left: 4px solid #E45B10;
          padding: 12px 16px;
          margin: 20px 0;
          font-size: 14px;
          color: #4a4a4a;
        }
        .signoff {
          margin-top: 24px;
          font-weight: 600;
          color: #1A3C34;
        }
        @media (max-width: 480px) {
          .container { margin: 20px 16px; }
          .header { padding: 20px; }
          .header h1 { font-size: 20px; }
          .content { padding: 24px; }
          .button { display: block; text-align: center; }
        }
      </style>
    </head>
    <body style="background-color: #f8f9fa; margin: 0; padding: 20px;">
      <table align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <tr>
          <td style="background: #f29007; padding: 30px 40px; text-align: center;">
<img src="https://app.culinarymedicineuk.training/EmailIcon.png" alt="Culinary Medicine UK" style="max-height: 60px; margin-bottom: 8px;" />
<h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">Fuel Your Future</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 40px; color: #1a1a1a; line-height: 1.6;">
            <h2 style="color: #1A3C34; font-size: 20px; margin-top: 0;">Welcome, ${firstName}! 👋</h2>
            <p style="font-size: 16px; color: #4a4a4a;">
              Thanks for joining the <strong>Culinary Medicine UK</strong> community. You're now part of a movement of chefs who are redefining the future of food—one healthy plate at a time.
            </p>
            <p style="font-size: 16px; color: #4a4a4a;">
              Please confirm your email address to get started with your personalised dashboard, recipes, and challenges.
            </p>
            <div style="text-align: center;">
              <a href="${confirmUrl}" style="display: inline-block; background: #E45B10; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px; margin: 20px 0 10px;">
                Confirm My Subscription
              </a>
            </div>
            <div class="allergen-note" style="background: #FFF4ED; border-left: 4px solid #E45B10; padding: 12px 16px; margin: 20px 0; font-size: 14px; color: #4a4a4a;">
              <strong>🥗 Your Health Matters</strong><br />
              We'll use your allergen preferences to alert you if any recipe contains ingredients you've flagged. You'll never see your full allergen list again—just helpful warnings when you need them.
            </div>
            <p style="font-size: 16px; color: #4a4a4a;">
              If you have any questions, reply to this email or reach out to our team.
            </p>
            <p class="signoff" style="margin-top: 24px; font-weight: 600; color: #1A3C34;">
              Eat Better • Feel Better • Learn Better • Work Better
            </p>
            <p style="font-size: 16px; color: #4a4a4a; margin-top: 8px;">
              — The CMUK Team
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding: 24px 40px; background: #f8f9fa; text-align: center; font-size: 14px; color: #888; border-top: 1px solid #eaeaea;">
            <p style="margin: 0 0 8px 0;">
              <a href="https://culinarymedicineuk.training" style="color: #E45B10; text-decoration: none;">Culinary Medicine UK</a>
            </p>
            <p style="margin: 0; font-size: 12px;">
              © ${new Date().getFullYear()} Culinary Medicine UK. All rights reserved.
            </p>
            <p style="margin: 4px 0 0 0; font-size: 12px;">
              You received this email because you signed up at <a href="https://app.culinarymedicineuk.training" style="color: #E45B10; text-decoration: none;">app.culinarymedicineuk.training</a>
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
