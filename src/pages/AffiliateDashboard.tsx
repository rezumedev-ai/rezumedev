
import { useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { DashboardMetrics } from "@/components/affiliate/DashboardMetrics"
import { LinkGenerator } from "@/components/affiliate/LinkGenerator"
import { useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export default function AffiliateDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    const checkAffiliateStatus = async () => {
      if (!user) return

      const { data: affiliate } = await supabase
        .from('affiliates')
        .select('status')
        .eq('user_id', user.id)
        .single()

      if (!affiliate) {
        navigate('/affiliate/apply')
      }
    }

    checkAffiliateStatus()
  }, [user])

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
