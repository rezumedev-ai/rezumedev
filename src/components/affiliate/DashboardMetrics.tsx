
import { Card } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2, TrendingUp, Users, DollarSign, Link } from "lucide-react"

export const DashboardMetrics = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["affiliate-metrics"],
    queryFn: async () => {
      // Get affiliate ID first
      const { data: affiliate } = await supabase
        .from('affiliates')
        .select('id')
        .single()

      if (!affiliate) throw new Error('No affiliate found')

      // Get metrics
      const { data: links } = await supabase
        .from('affiliate_links')
        .select('id')
        .eq('affiliate_id', affiliate.id)

      const { data: clicks } = await supabase
        .from('affiliate_clicks')
        .select('id')
        .in('link_id', links?.map(l => l.id) || [])

      const { data: conversions } = await supabase
        .from('affiliate_conversions')
        .select('amount, commission_amount')
        .in('click_id', clicks?.map(c => c.id) || [])

      return {
        totalLinks: links?.length || 0,
        totalClicks: clicks?.length || 0,
        totalSales: conversions?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0,
        totalCommissions: conversions?.reduce((acc, curr) => acc + (curr.commission_amount || 0), 0) || 0,
      }
    }
  })

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Link className="h-8 w-8 text-blue-500" />
          <div>
            <p className="text-sm text-muted-foreground">Total Links</p>
            <h3 className="text-2xl font-bold">{metrics?.totalLinks}</h3>
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Users className="h-8 w-8 text-green-500" />
          <div>
            <p className="text-sm text-muted-foreground">Total Clicks</p>
            <h3 className="text-2xl font-bold">{metrics?.totalClicks}</h3>
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <TrendingUp className="h-8 w-8 text-purple-500" />
          <div>
            <p className="text-sm text-muted-foreground">Total Sales</p>
            <h3 className="text-2xl font-bold">${metrics?.totalSales.toFixed(2)}</h3>
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <DollarSign className="h-8 w-8 text-yellow-500" />
          <div>
            <p className="text-sm text-muted-foreground">Commissions</p>
            <h3 className="text-2xl font-bold">${metrics?.totalCommissions.toFixed(2)}</h3>
          </div>
        </div>
      </Card>
    </div>
  )
}
