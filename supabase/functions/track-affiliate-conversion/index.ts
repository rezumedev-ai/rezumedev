
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { clickId, userId, amount, conversionType } = await req.json()
    
    // Get the click record to find associated affiliate
    const { data: clickData, error: clickError } = await supabaseClient
      .from('affiliate_clicks')
      .select('link_id')
      .eq('id', clickId)
      .single()

    if (clickError || !clickData) {
      throw new Error('Invalid click ID or click not found')
    }

    // Get the affiliate link to find the affiliate
    const { data: linkData, error: linkError } = await supabaseClient
      .from('affiliate_links')
      .select('affiliate_id')
      .eq('id', clickData.link_id)
      .single()

    if (linkError || !linkData) {
      throw new Error('Affiliate link not found')
    }

    // Get the affiliate to determine commission rate
    const { data: affiliate, error: affiliateError } = await supabaseClient
      .from('affiliates')
      .select('commission_rate')
      .eq('id', linkData.affiliate_id)
      .single()

    if (affiliateError || !affiliate) {
      throw new Error('Affiliate not found')
    }

    // Calculate commission
    const commissionRate = affiliate.commission_rate / 100
    const commissionAmount = amount * commissionRate

    // Record the conversion
    const { data: conversion, error: conversionError } = await supabaseClient
      .from('affiliate_conversions')
      .insert({
        click_id: clickId,
        user_id: userId,
        amount: amount,
        commission_amount: commissionAmount,
        conversion_type: conversionType,
        status: 'completed'
      })
      .select()
      .single()

    if (conversionError) {
      throw conversionError
    }

    // Update affiliate balance
    const { error: updateError } = await supabaseClient.rpc('update_affiliate_balance', {
      affiliate_id: linkData.affiliate_id,
      amount_to_add: commissionAmount
    })

    if (updateError) {
      throw updateError
    }

    return new Response(
      JSON.stringify({ success: true, data: conversion }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
