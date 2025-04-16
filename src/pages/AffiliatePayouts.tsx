
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { SimplifiedHeader } from "@/components/SimplifiedHeader"
import { Loader2, Calendar, DollarSign, BadgeCheck, Ban } from "lucide-react"

export default function AffiliatePayouts() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [affiliate, setAffiliate] = useState(null)
  const [payouts, setPayouts] = useState([])
  const [paymentDetails, setPaymentDetails] = useState(null)

  useEffect(() => {
    const fetchAffiliateData = async () => {
      if (!user) return

      try {
        const { data: affiliateData, error: affiliateError } = await supabase
          .from('affiliates')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (affiliateError || !affiliateData) {
          navigate('/affiliate/apply')
          return
        }

        setAffiliate(affiliateData)
        setPaymentDetails(affiliateData.payment_details || {})

        // Fetch payouts
        const { data: payoutsData } = await supabase
          .from('affiliate_payments')
          .select('*')
          .eq('affiliate_id', affiliateData.id)
          .order('created_at', { ascending: false })

        setPayouts(payoutsData || [])
      } catch (error) {
        console.error("Error fetching affiliate data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAffiliateData()
  }, [user, navigate])

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'paid':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <BadgeCheck className="w-3 h-3 mr-1" />Paid
        </span>
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />Pending
        </span>
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <Ban className="w-3 h-3 mr-1" />Rejected
        </span>
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/20">
      <SimplifiedHeader />
      
      <div className="container mx-auto py-8 px-4 space-y-8 max-w-4xl">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Affiliate Payouts</h1>
          <Button onClick={() => navigate('/affiliate/dashboard')}>Back to Dashboard</Button>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-2xl font-bold">${affiliate?.balance?.toFixed(2) || '0.00'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Method</p>
              <p className="text-lg">{affiliate?.payment_method || 'Not set'}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {paymentDetails?.[affiliate?.payment_method] || 'No payment details provided'}
              </p>
            </div>
          </div>
          <div className="mt-6 border-t pt-4">
            <p className="text-sm text-muted-foreground">
              Note: Payouts are processed monthly for balances over $50. If your balance is less than $50,
              it will roll over to the next month.
            </p>
          </div>
        </Card>

        <div>
          <h2 className="text-xl font-semibold mb-4">Payout History</h2>
          {payouts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted rounded-lg">
                  <tr>
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Amount</th>
                    <th className="py-3 px-4 text-left">Method</th>
                    <th className="py-3 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((payout) => (
                    <tr key={payout.id} className="border-b">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          {formatDate(payout.created_at)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                          {payout.amount.toFixed(2)}
                        </div>
                      </td>
                      <td className="py-4 px-4">{payout.payment_method}</td>
                      <td className="py-4 px-4">
                        {getStatusBadge(payout.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Card className="p-6 text-center bg-muted/30">
              <p className="text-muted-foreground">You don't have any payouts yet.</p>
              <p className="text-sm mt-2">Once your balance reaches $50, you'll be eligible for a payout.</p>
            </Card>
          )}
        </div>

        <Card className="p-6 bg-primary/5 border-primary/20">
          <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
          <p className="text-muted-foreground mb-4">
            If you have any questions about payouts or need to update your payment information,
            please contact our support team.
          </p>
          <Button variant="outline">Contact Support</Button>
        </Card>
      </div>
    </div>
  )
}
