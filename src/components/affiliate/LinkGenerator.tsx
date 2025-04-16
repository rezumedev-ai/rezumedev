
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Copy, Link } from "lucide-react"

export const LinkGenerator = () => {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const generateLink = async () => {
    try {
      setLoading(true)

      // Get affiliate ID
      const { data: affiliate } = await supabase
        .from('affiliates')
        .select('id')
        .single()

      if (!affiliate) throw new Error('No affiliate found')

      // Generate a unique code
      const code = Math.random().toString(36).substring(2, 8)
      
      // Create new link
      const { data: link, error } = await supabase
        .from('affiliate_links')
        .insert({
          affiliate_id: affiliate.id,
          name,
          code,
          target_url: window.location.origin
        })
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Link Created",
        description: "Your affiliate link has been generated successfully"
      })

      setName("")
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

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(`${window.location.origin}?ref=${code}`)
    toast({
      title: "Copied!",
      description: "Link copied to clipboard"
    })
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Generate Affiliate Link</h3>
      <div className="flex gap-4">
        <Input
          placeholder="Link name (e.g., Facebook Campaign)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button onClick={generateLink} disabled={loading || !name}>
          Generate
        </Button>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium mb-2">Your Links</h4>
        <div className="space-y-2">
          {data?.map((link) => (
            <div key={link.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                <span>{link.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(link.code)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
