
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { DashboardMetrics } from "@/components/affiliate/DashboardMetrics"
import { LinkGenerator } from "@/components/affiliate/LinkGenerator"
import { useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { useAffiliateTracking } from "@/hooks/use-affiliate-tracking"

export default function AffiliateDashboard() {
  useAffiliateTracking(); // Use the tracking hook
  
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [hasAffiliateAccount, setHasAffiliateAccount] = useState(false)

  useEffect(() => {
    const checkAffiliateStatus = async () => {
      if (!user) return

      try {
        const { data: affiliate, error } = await supabase
          .from('affiliates')
          .select('status')
          .eq('user_id', user.id)
          .single()

        if (error) {
          console.error("Error checking affiliate status:", error)
          // If there's a specific not found error, redirect to apply page
          if (error.code === 'PGRST116') {
            navigate('/affiliate/apply')
            return
          }
        }

        if (!affiliate) {
          navigate('/affiliate/apply')
          return
        }
        
        setHasAffiliateAccount(true)
      } catch (error) {
        console.error("Error in checkAffiliateStatus:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was a problem checking your affiliate status. Please try again later."
        })
      } finally {
        setLoading(false)
      }
    }

    checkAffiliateStatus()
  }, [user, navigate, toast])

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!hasAffiliateAccount) {
    return null // We'll redirect in the useEffect so no need to render anything
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Affiliate Dashboard</h1>
        <Button onClick={() => navigate('/affiliate/payouts')}>View Payouts</Button>
      </div>

      <DashboardMetrics />
      
      <div className="grid gap-8 md:grid-cols-2">
        <LinkGenerator />
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Tips</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Share your links on social media and your website</li>
            <li>• Track your performance in real-time</li>
            <li>• Commissions are paid monthly via your chosen payment method</li>
            <li>• Need help? Contact our affiliate support team</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
