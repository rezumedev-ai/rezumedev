
import { Card } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2, TrendingUp, Users, DollarSign, Link } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export const DashboardMetrics = () => {
  const { user } = useAuth()
  
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ["affiliate-metrics", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated")
      
      // Get affiliate ID first
      const { data: affiliate, error: affiliateError } = await supabase
        .from('affiliates')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (affiliateError || !affiliate) {
        console.error("Error fetching affiliate:", affiliateError)
        throw new Error("No affiliate found")
      }

      // Get links for this affiliate
      const { data: links, error: linksError } = await supabase
        .from('affiliate_links')
        .select('id')
        .eq('affiliate_id', affiliate.id)

      if (linksError) {
        console.error("Error fetching links:", linksError)
        throw new Error("Failed to fetch affiliate links")
      }
      
      // If no links, return empty metrics
      if (!links || links.length === 0) {
        return {
          totalLinks: 0,
          totalClicks: 0,
          totalSales: 0,
          totalCommissions: 0,
        }
      }

      // Get clicks for these links
      const { data: clicks, error: clicksError } = await supabase
        .from('affiliate_clicks')
        .select('id')
        .in('link_id', links.map(l => l.id))

      if (clicksError) {
        console.error("Error fetching clicks:", clicksError)
        throw new Error("Failed to fetch affiliate clicks")
      }
      
      // If no clicks, return metrics with only link count
      if (!clicks || clicks.length === 0) {
        return {
          totalLinks: links.length,
          totalClicks: 0,
          totalSales: 0,
          totalCommissions: 0,
        }
      }
      
      // Get conversions for these clicks
      const { data: conversions, error: conversionsError } = await supabase
        .from('affiliate_conversions')
        .select('amount, commission_amount')
        .in('click_id', clicks.map(c => c.id))

      if (conversionsError) {
        console.error("Error fetching conversions:", conversionsError)
        throw new Error("Failed to fetch conversions")
      }

      return {
        totalLinks: links.length || 0,
        totalClicks: clicks.length || 0,
        totalSales: conversions ? conversions.reduce((acc, curr) => acc + (curr.amount || 0), 0) : 0,
        totalCommissions: conversions ? conversions.reduce((acc, curr) => acc + (curr.commission_amount || 0), 0) : 0,
      }
    },
    enabled: !!user,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="text-center text-muted-foreground text-sm">
              Error loading metrics
            </div>
          </Card>
        ))}
      </div>
    )
  }

  const defaultMetrics = {
    totalLinks: 0,
    totalClicks: 0,
    totalSales: 0,
    totalCommissions: 0,
  }

  const data = metrics || defaultMetrics

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Link className="h-8 w-8 text-blue-500" />
          <div>
            <p className="text-sm text-muted-foreground">Total Links</p>
            <h3 className="text-2xl font-bold">{data.totalLinks}</h3>
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Users className="h-8 w-8 text-green-500" />
          <div>
            <p className="text-sm text-muted-foreground">Total Clicks</p>
            <h3 className="text-2xl font-bold">{data.totalClicks}</h3>
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <TrendingUp className="h-8 w-8 text-purple-500" />
          <div>
            <p className="text-sm text-muted-foreground">Total Sales</p>
            <h3 className="text-2xl font-bold">${data.totalSales.toFixed(2)}</h3>
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <DollarSign className="h-8 w-8 text-yellow-500" />
          <div>
            <p className="text-sm text-muted-foreground">Commissions</p>
            <h3 className="text-2xl font-bold">${data.totalCommissions.toFixed(2)}</h3>
          </div>
        </div>
      </Card>
    </div>
  )
}
