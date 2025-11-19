'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Scissors, Users, Award, Clock } from 'lucide-react'

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            About UpToDate Selection
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Your trusted partner in premium fabric selection and professional tailoring services. 
            We bring decades of expertise in creating perfectly fitted garments that reflect your style and personality.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-accent mb-2">25+</div>
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </CardContent>
          </Card>
          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-accent mb-2">5000+</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </CardContent>
          </Card>
          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-accent mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Fabric Varieties</div>
            </CardContent>
          </Card>
          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-accent mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Satisfaction</div>
            </CardContent>
          </Card>
        </div>

        {/* Our Story */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Founded with a passion for exceptional craftsmanship, UpToDate Selection has been serving 
              customers with premium fabrics and expert tailoring services for over two decades.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              We specialize in creating custom-fitted garments including shirts, pants, suits, kurtas, 
              and traditional wear using the finest fabrics sourced from renowned mills.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our commitment to quality, attention to detail, and personalized service has made us 
              a trusted name in the tailoring industry.
            </p>
          </div>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-accent/10 p-3 rounded-lg">
                <Scissors className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Expert Craftsmanship</h3>
                <p className="text-sm text-muted-foreground">
                  Master tailors with decades of experience in creating perfect fits
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-accent/10 p-3 rounded-lg">
                <Award className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Premium Quality</h3>
                <p className="text-sm text-muted-foreground">
                  Only the finest fabrics and materials for lasting durability
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-accent/10 p-3 rounded-lg">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Personalized Service</h3>
                <p className="text-sm text-muted-foreground">
                  Individual attention and customization for every customer
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-accent/10 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Timely Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Reliable delivery schedules to meet your important occasions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Services Overview */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-8">What We Offer</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <CardContent className="p-0 text-center">
                <Badge variant="secondary" className="mb-4">Shirts</Badge>
                <h3 className="font-semibold text-foreground mb-3">Custom Shirts</h3>
                <p className="text-sm text-muted-foreground">
                  Formal and casual shirts tailored to your exact measurements and style preferences
                </p>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardContent className="p-0 text-center">
                <Badge variant="secondary" className="mb-4">Suits</Badge>
                <h3 className="font-semibold text-foreground mb-3">Business Suits</h3>
                <p className="text-sm text-muted-foreground">
                  Professional suits crafted with precision for the perfect business look
                </p>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardContent className="p-0 text-center">
                <Badge variant="secondary" className="mb-4">Traditional</Badge>
                <h3 className="font-semibold text-foreground mb-3">Ethnic Wear</h3>
                <p className="text-sm text-muted-foreground">
                  Kurtas, sherwanis, and traditional garments for special occasions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mission Statement */}
        <Card className="bg-accent/5 border-accent/20 p-8 text-center">
          <CardContent className="p-0">
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              To provide exceptional tailoring services that combine traditional craftsmanship with 
              modern style, ensuring every customer feels confident and perfectly dressed for any occasion.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default About