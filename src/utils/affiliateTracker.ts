
import { supabase } from "@/integrations/supabase/client";

/**
 * Track affiliate clicks
 * @param {string} refCode - The affiliate reference code
 */
export const trackAffiliateClick = async (refCode: string) => {
  try {
    if (!refCode) return;
    
    // Get referring page
    const referrer = document.referrer || null;
    
    // Call the edge function to track the click
    const { data, error } = await supabase.functions.invoke("track-affiliate-click", {
      body: { code: refCode, referrer }
    });
    
    if (error) throw error;
    
    // Store cookie ID for conversion tracking later
    if (data?.cookieId) {
      localStorage.setItem('aff_click_id', data.cookieId);
    }
    
    console.log("Affiliate click tracked successfully");
    return data;
  } catch (error) {
    console.error("Error tracking affiliate click:", error);
  }
};

/**
 * Track affiliate conversion
 * @param {string} conversionType - Type of conversion (signup, subscription, etc)
 * @param {number} amount - Amount of the transaction (if applicable)
 */
export const trackAffiliateConversion = async (conversionType: string, amount?: number) => {
  try {
    const cookieId = localStorage.getItem('aff_click_id');
    if (!cookieId) return; // No affiliate referral
    
    const { data: clickData } = await supabase
      .from('affiliate_clicks')
      .select('id, link_id')
      .eq('cookie_id', cookieId)
      .single();
      
    if (!clickData) return;
    
    // Get current user if logged in
    const { data: { user } } = await supabase.auth.getUser();
    
    // Record the conversion
    const { data, error } = await supabase
      .from('affiliate_conversions')
      .insert({
        click_id: clickData.id,
        user_id: user?.id || null,
        conversion_type: conversionType,
        amount: amount || 0,
        status: 'completed'
      });
      
    if (error) throw error;
    
    console.log("Affiliate conversion tracked successfully");
    return data;
  } catch (error) {
    console.error("Error tracking affiliate conversion:", error);
  }
};
