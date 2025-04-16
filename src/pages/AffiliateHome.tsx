
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SimplifiedHeader } from "@/components/SimplifiedHeader"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useAffiliateTracking } from "@/hooks/use-affiliate-tracking"
import { DollarSign, Users, Zap, CheckCircle } from "lucide-react"

export default function AffiliateHome() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isAffiliate, setIsAffiliate] = useState(false)
  const [loading, setLoading] = useState(true)
  
  // Track affiliate referrals
  useAffiliateTracking()
  
  useEffect(() => {
    const checkAffiliateStatus = async () => {
      if (!user) {
        setLoading(false)
        return
      }
      
      const { data: affiliate } = await supabase
        .from('affiliates')
        .select('status')
        .eq('user_id', user.id)
        .single()
        
      setIsAffiliate(!!affiliate)
      setLoading(false)
    }
    
    checkAffiliateStatus()
  }, [user])
  
  const handleGetStarted = () => {
    if (!user) {
      navigate('/signup')
    } else if (isAffiliate) {
      navigate('/affiliate/dashboard')
    } else {
      navigate('/affiliate/apply')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <SimplifiedHeader />
      
      <main className="container mx-auto px-4 py-24">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 mb-6">
            Earn Money Referring Users to Rezume.dev
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Join our affiliate program and earn commission for every new paid subscription through your unique referral link.
          </p>
          <Button size="lg" onClick={handleGetStarted} className="px-8 py-6 text-lg">
            {loading ? "Loading..." : user ? (isAffiliate ? "Go to Dashboard" : "Apply Now") : "Get Started"}
          </Button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Earn 20% Commission</h3>
              <p className="text-gray-500">Earn 20% on every paid subscription from users you refer to Rezume.dev.</p>
            </div>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Payouts</h3>
              <p className="text-gray-500">Get your commissions paid out monthly via your preferred payment method.</p>
            </div>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Tracking</h3>
              <p className="text-gray-500">Track your referrals, clicks, and earnings with our intuitive dashboard.</p>
            </div>
          </Card>
        </div>
        
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 font-bold text-primary">1</div>
              <h3 className="font-semibold mb-2">Apply</h3>
              <p className="text-gray-500">Sign up as an affiliate by filling out our simple application form.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 font-bold text-primary">2</div>
              <h3 className="font-semibold mb-2">Get Your Link</h3>
              <p className="text-gray-500">Generate your unique referral link from your affiliate dashboard.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 font-bold text-primary">3</div>
              <h3 className="font-semibold mb-2">Share</h3>
              <p className="text-gray-500">Share your link on your website, social media, or with your network.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 font-bold text-primary">4</div>
              <h3 className="font-semibold mb-2">Earn</h3>
              <p className="text-gray-500">Earn commissions whenever someone signs up through your link.</p>
            </div>
          </div>
        </div>
        
        <div className="mt-24 bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6 max-w-3xl mx-auto">
            <div>
              <h3 className="font-semibold text-lg mb-2">How much can I earn?</h3>
              <p className="text-gray-600">You earn 20% commission on every paid subscription from users you refer. There's no cap on how much you can earn.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">When do I get paid?</h3>
              <p className="text-gray-600">Commissions are paid out monthly, provided you've reached the minimum payout threshold of $50.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Who can join the affiliate program?</h3>
              <p className="text-gray-600">Anyone can apply to join our affiliate program. We especially welcome content creators, career coaches, and job search experts.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">How long do referral cookies last?</h3>
              <p className="text-gray-600">Our referral cookies last for 30 days, giving your referrals plenty of time to make a purchase.</p>
            </div>
          </div>
        </div>
        
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Start Earning?</h2>
          <Button size="lg" onClick={handleGetStarted} className="px-8 py-6 text-lg">
            {loading ? "Loading..." : user ? (isAffiliate ? "Go to Dashboard" : "Apply Now") : "Get Started"}
          </Button>
        </div>
      </main>
    </div>
  )
}
