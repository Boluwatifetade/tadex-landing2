import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Init Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const { email, selectedPlan, tradingVolume, currentTool } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    if (!selectedPlan) {
      return NextResponse.json({ error: 'Plan selection is required' }, { status: 400 });
    }

    // Insert into plan_waitlist
    const { data, error } = await supabase
      .from('plan_waitlist')
      .insert({
        email: email.toLowerCase().trim(),
        selected_plan: selectedPlan,
        trading_volume: tradingVolume || null,
        current_tool: currentTool || null,
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      if (error.code === '23505' || /duplicate key/i.test(error.message)) {
        return NextResponse.json(
          { error: 'This email is already registered for the waitlist' },
          { status: 409 }
        );
      }
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save to waitlist. Please try again.' },
        { status: 500 }
      );
    }

    // No Resend email sending here

    return NextResponse.json({
      success: true,
      message: 'Successfully added to waitlist!',
      data: data?.[0],
    });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
