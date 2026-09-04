import { Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';
import { resend } from '../lib/resend.js';
import { generateConfirmationEmail } from '../lib/emailTemplate.js';

export async function handleSubscribe(req: Request, res: Response) {
  try {
    const { first_name, email, has_allergens, allergens } = req.body;

    // Validate required fields
    if (!first_name || !email) {
      return res.status(400).json({ 
        error: 'First name and email are required.' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Please enter a valid email address.' 
      });
    }

    // Check if email already exists and is active
    const { data: existing } = await supabase
      .from('subscribers')
      .select('status')
      .eq('email', email)
      .single();

    if (existing?.status === 'active') {
      return res.status(400).json({ 
        error: 'This email is already subscribed. Please check your inbox.' 
      });
    }

    // Generate confirmation token
    const confirmationToken = crypto.randomUUID();

    // Save to Supabase
    const { error: dbError } = await supabase
      .from('subscribers')
      .upsert(
        {
          first_name,
          email,
          has_allergens: has_allergens || false,
          allergens: allergens || [],
          status: 'pending',
          confirmation_token: confirmationToken,
          confirmed_at: null,
        },
        { onConflict: 'email' }
      );

    if (dbError) {
      console.error('Supabase error:', dbError);
      return res.status(500).json({ 
        error: 'Something went wrong. Please try again.' 
      });
    }

    // Send confirmation email
    const confirmUrl = `${process.env.VITE_APP_URL}/confirm?token=${confirmationToken}`;
    const emailHtml = generateConfirmationEmail(first_name, confirmUrl);

    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: 'Confirm your CMUK subscription',
      html: emailHtml,
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Check your email to confirm your subscription!' 
    });

  } catch (error) {
    console.error('Subscribe error:', error);
    return res.status(500).json({ 
      error: 'Something went wrong. Please try again.' 
    });
  }
}
