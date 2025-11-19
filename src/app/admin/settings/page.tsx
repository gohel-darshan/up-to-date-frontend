'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  Settings,
  Save,
  Database,
  Mail,
  CreditCard,
  Shield,
  Bell,
  Globe,
  Users,
  Package,
  Truck,
  AlertTriangle
} from 'lucide-react'

interface AdminSettings {
  siteName: string
  siteDescription: string
  contactEmail: string
  supportEmail: string
  phone: string
  address: string
  currency: string
  taxRate: number
  shippingCost: number
  freeShippingThreshold: number
  emailNotifications: boolean
  smsNotifications: boolean
  inventoryAlerts: boolean
  lowStockThreshold: number
  autoApproveReviews: boolean
  maintenanceMode: boolean
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<AdminSettings>({
    siteName: 'UpToDate Selection',
    siteDescription: 'Premium fabric selection and tailoring services',
    contactEmail: 'contact@uptodateselection.com',
    supportEmail: 'support@uptodateselection.com',
    phone: '+91 9876543210',
    address: '123 Fashion Street, Mumbai, Maharashtra 400001',
    currency: 'INR',
    taxRate: 18,
    shippingCost: 100,
    freeShippingThreshold: 2000,
    emailNotifications: true,
    smsNotifications: false,
    inventoryAlerts: true,
    lowStockThreshold: 10,
    autoApproveReviews: false,
    maintenanceMode: false
  })
  
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = (key: keyof AdminSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your store configuration and preferences</p>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              General Settings
            </CardTitle>
            <CardDescription>Basic store information and configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => updateSetting('siteName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => updateSetting('siteDescription', e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => updateSetting('contactEmail', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={settings.supportEmail}
                onChange={(e) => updateSetting('supportEmail', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) => updateSetting('phone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="address">Business Address</Label>
              <Textarea
                id="address"
                value={settings.address}
                onChange={(e) => updateSetting('address', e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Financial Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Financial Settings
            </CardTitle>
            <CardDescription>Currency, tax, and pricing configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={settings.currency}
                onChange={(e) => updateSetting('currency', e.target.value)}
                placeholder="INR"
              />
            </div>
            <div>
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                value={settings.taxRate}
                onChange={(e) => updateSetting('taxRate', parseFloat(e.target.value))}
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            <div>
              <Label htmlFor="shippingCost">Standard Shipping Cost (₹)</Label>
              <Input
                id="shippingCost"
                type="number"
                value={settings.shippingCost}
                onChange={(e) => updateSetting('shippingCost', parseFloat(e.target.value))}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (₹)</Label>
              <Input
                id="freeShippingThreshold"
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => updateSetting('freeShippingThreshold', parseFloat(e.target.value))}
                min="0"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notification Settings
            </CardTitle>
            <CardDescription>Configure alerts and notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <p className="text-sm text-gray-500">Receive order and system notifications via email</p>
              </div>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="smsNotifications">SMS Notifications</Label>
                <p className="text-sm text-gray-500">Receive urgent notifications via SMS</p>
              </div>
              <Switch
                id="smsNotifications"
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => updateSetting('smsNotifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="inventoryAlerts">Inventory Alerts</Label>
                <p className="text-sm text-gray-500">Get notified when products are low in stock</p>
              </div>
              <Switch
                id="inventoryAlerts"
                checked={settings.inventoryAlerts}
                onCheckedChange={(checked) => updateSetting('inventoryAlerts', checked)}
              />
            </div>
            {settings.inventoryAlerts && (
              <div>
                <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                <Input
                  id="lowStockThreshold"
                  type="number"
                  value={settings.lowStockThreshold}
                  onChange={(e) => updateSetting('lowStockThreshold', parseInt(e.target.value))}
                  min="1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Alert when product stock falls below this number
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              System Settings
            </CardTitle>
            <CardDescription>Advanced system configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoApproveReviews">Auto-approve Reviews</Label>
                <p className="text-sm text-gray-500">Automatically publish customer reviews</p>
              </div>
              <Switch
                id="autoApproveReviews"
                checked={settings.autoApproveReviews}
                onCheckedChange={(checked) => updateSetting('autoApproveReviews', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <div>
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                  <p className="text-sm text-gray-500">Temporarily disable the store for maintenance</p>
                </div>
              </div>
              <Switch
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => updateSetting('maintenanceMode', checked)}
              />
            </div>
            {settings.maintenanceMode && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800">
                  <AlertTriangle className="h-4 w-4 inline mr-1" />
                  Store is currently in maintenance mode. Customers cannot place orders.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            System Information
          </CardTitle>
          <CardDescription>Current system status and information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="font-medium">Total Users</h3>
              <p className="text-2xl font-bold text-blue-600">1,234</p>
              <Badge variant="secondary" className="mt-1">Active</Badge>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Package className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="font-medium">Total Products</h3>
              <p className="text-2xl font-bold text-green-600">567</p>
              <Badge variant="secondary" className="mt-1">In Stock</Badge>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Truck className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="font-medium">Pending Orders</h3>
              <p className="text-2xl font-bold text-purple-600">89</p>
              <Badge variant="secondary" className="mt-1">Processing</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Database className="h-6 w-6 mb-2" />
              <span>Backup Data</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Mail className="h-6 w-6 mb-2" />
              <span>Send Newsletter</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Shield className="h-6 w-6 mb-2" />
              <span>Security Audit</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Settings className="h-6 w-6 mb-2" />
              <span>System Logs</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}