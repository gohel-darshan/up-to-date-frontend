'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Shirt, Scissors, Ruler, Clock, CheckCircle, Star } from 'lucide-react'
import Link from 'next/link'

const Services = () => {
  const services = [
    {
      icon: <Shirt className="h-8 w-8" />,
      title: "Custom Shirts",
      description: "Perfectly fitted formal and casual shirts tailored to your measurements",
      features: ["Premium fabrics", "Perfect fit guarantee", "Multiple collar styles", "Monogramming available"],
      price: "Starting from ₹2,500",
      duration: "7-10 days"
    },
    {
      icon: <Scissors className="h-8 w-8" />,
      title: "Business Suits",
      description: "Professional suits crafted with precision for the modern gentleman",
      features: ["2-piece & 3-piece options", "Italian & British cuts", "Premium linings", "Alterations included"],
      price: "Starting from ₹15,000",
      duration: "14-21 days"
    },
    {
      icon: <Ruler className="h-8 w-8" />,
      title: "Formal Pants",
      description: "Tailored trousers that complement your style and provide comfort",
      features: ["Multiple fits available", "Quality fabrics", "Perfect waist fit", "Hemming service"],
      price: "Starting from ₹2,000",
      duration: "5-7 days"
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Ethnic Wear",
      description: "Traditional kurtas, sherwanis, and ethnic garments for special occasions",
      features: ["Traditional designs", "Festival collections", "Wedding specials", "Custom embroidery"],
      price: "Starting from ₹3,000",
      duration: "10-14 days"
    }
  ]

  const process = [
    {
      step: "1",
      title: "Consultation",
      description: "Discuss your requirements and fabric preferences"
    },
    {
      step: "2", 
      title: "Measurements",
      description: "Precise measurements taken by our expert tailors"
    },
    {
      step: "3",
      title: "Fitting",
      description: "First fitting to ensure perfect fit and comfort"
    },
    {
      step: "4",
      title: "Delivery",
      description: "Final delivery of your perfectly tailored garment"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Our Tailoring Services
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From custom shirts to complete suits, we offer comprehensive tailoring services 
            with attention to detail and commitment to quality.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center space-x-4 mb-3">
                  <div className="bg-accent/10 p-3 rounded-lg text-accent">
                    {service.icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge variant="outline">{service.price}</Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {service.duration}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4">{service.description}</p>
                <div className="space-y-2 mb-4">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full" asChild>
                  <Link href="/products">View Fabrics</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Process Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Our Process</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-accent text-accent-foreground w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Services */}
        <Card className="p-8 bg-accent/5 border-accent/20">
          <CardContent className="p-0">
            <h2 className="text-2xl font-bold text-center text-foreground mb-8">Additional Services</h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Alterations</h3>
                <p className="text-sm text-muted-foreground">Professional alterations for existing garments</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Rush Orders</h3>
                <p className="text-sm text-muted-foreground">Express service for urgent requirements</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Home Service</h3>
                <p className="text-sm text-muted-foreground">Measurement and fitting at your convenience</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Services