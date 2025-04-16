
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

export default function AffiliateApplication() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    paymentMethod: "paypal",
    paymentDetails: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      setLoading(true)

      const { error } = await supabase
        .from('affiliates')
        .insert({
          user_id: user.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          payment_method: formData.paymentMethod,
          payment_details: { [formData.paymentMethod]: formData.paymentDetails }
        })

      if (error) throw error

      toast({
        title: "Application Submitted",
        description: "We'll review your application and get back to you soon."
      })

      navigate('/affiliate/dashboard')
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-lg">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Become an Affiliate</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">First Name</label>
            <Input
              required
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Last Name</label>
            <Input
              required
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Payment Details (PayPal email)</label>
            <Input
              required
              value={formData.paymentDetails}
              onChange={(e) => setFormData(prev => ({ ...prev, paymentDetails: e.target.value }))}
              placeholder="your.email@example.com"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </Card>
    </div>
  )
}
