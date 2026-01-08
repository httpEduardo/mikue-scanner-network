import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { WifiHigh, CheckCircle, Warning } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import MikuCharacter from './MikuCharacter'

interface NetworkData {
  ip: string
  country?: string
  city?: string
  region?: string
  isp?: string
  timezone?: string
  latitude?: number
  longitude?: number
}

export default function NetworkInfo() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<NetworkData | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchNetworkInfo()
  }, [])

  const fetchNetworkInfo = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('https://ipapi.co/json/')
      const result = await response.json()

      if (result.error) {
        setError(result.reason || 'Failed to fetch network information')
        setLoading(false)
        return
      }

      setData({
        ip: result.ip,
        country: result.country_name,
        city: result.city,
        region: result.region,
        isp: result.org,
        timezone: result.timezone,
        latitude: result.latitude,
        longitude: result.longitude
      })
    } catch (err) {
      setError('Unable to fetch network information')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="glow-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WifiHigh className="text-primary" size={24} weight="duotone" />
              My Network Info
            </CardTitle>
            <CardDescription>
              Loading your network information...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-8">
              <MikuCharacter mood="scanning" size="medium" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="glow-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WifiHigh className="text-primary" size={24} weight="duotone" />
              My Network Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <Warning size={18} />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="glow-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WifiHigh className="text-primary" size={24} weight="duotone" />
              My Network Info
            </CardTitle>
            <CardDescription>
              Your current network and location information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg border border-primary/30 bg-primary/5">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Your IP Address</p>
                <p className="font-mono text-2xl text-primary font-bold">{data?.ip}</p>
              </div>

              {data?.country && (
                <div className="p-4 rounded-lg border border-border/50 bg-muted/20">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Location</p>
                  <p className="font-medium text-lg">
                    {data.city}, {data.country}
                  </p>
                  {data.region && (
                    <p className="text-sm text-muted-foreground">{data.region}</p>
                  )}
                </div>
              )}

              {data?.isp && (
                <div className="p-4 rounded-lg border border-border/50 bg-muted/20">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">ISP/Provider</p>
                  <p className="font-medium">{data.isp}</p>
                </div>
              )}

              {data?.timezone && (
                <div className="p-4 rounded-lg border border-border/50 bg-muted/20">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Timezone</p>
                  <p className="font-medium">{data.timezone}</p>
                </div>
              )}

              {data?.latitude && data?.longitude && (
                <div className="md:col-span-2 p-4 rounded-lg border border-border/50 bg-muted/20">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Coordinates</p>
                  <p className="font-mono">
                    {data.latitude.toFixed(4)}, {data.longitude.toFixed(4)}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/10 border border-accent/30">
              <CheckCircle className="text-accent" size={20} weight="duotone" />
              <p className="text-sm text-muted-foreground">
                Connected and ready to scan networks!
              </p>
            </div>

            <div className="flex justify-center pt-4">
              <MikuCharacter mood="success" size="large" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
