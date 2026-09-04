import { Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';

export async function handleConfirm(req: Request, res: Response) {
  try {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid or missing confirmation token.' 
      });
    }

    // Find subscriber with this token
    const { data: subscriber, error: findError } = await supabase
      .from('subscribers')
      .select('id, email, first_name, status')
      .eq('confirmation_token', token)
      .single();

    if (findError || !subscriber) {
      return res.status(400).json({ 
        error: 'Invalid or expired confirmation token.' 
      });
    }

    if (subscriber.status === 'active') {
      return res.status(400).json({ 
        error: 'This email is already confirmed. Please log in.' 
      });
    }

    // Update status to active
    const { error: updateError } = await supabase
      .from('subscribers')
      .update({
        status: 'active',
        confirmed_at: new Date().toISOString(),
        confirmation_token: null, // Clear token after confirmation
      })
      .eq('id', subscriber.id);

    if (updateError) {
      console.error('Update error:', updateError);
      return res.status(500).json({ 
        error: 'Failed to confirm subscription. Please try again.' 
      });
    }

    // Return user data for dashboard redirect
    return res.status(200).json({
      success: true,
      user: {
        id: subscriber.id,
        first_name: subscriber.first_name,
        email: subscriber.email,
      }
    });

  } catch (error) {
    console.error('Confirm error:', error);
    return res.status(500).json({ 
      error: 'Something went wrong. Please try again.' 
    });
  }
}
