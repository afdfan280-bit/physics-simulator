'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Activity, Scale, Atom, Waves, Zap, Play } from 'lucide-react'

const modules = [
  {
    title: 'Force & Motion',
    description: 'Explore Newton\'s Laws of Motion with interactive simulations of forces, acceleration, and momentum.',
    icon: Activity,
    href: '/force-motion',
    features: [
      'Interactive force vectors',
      'Real-time physics calculations',
      'Collision simulations',
      'Inclined planes and pulleys'
    ]
  },
  {
    title: 'Pressure & Buoyancy',
    description: 'Discover Archimedes\' Principle through fluid simulations and buoyancy experiments.',
    icon: Scale,
    href: '/pressure-buoyancy',
    features: [
      'Fluid density controls',
      'Object submersion',
      'Pressure visualization',
      'Buoyant force calculations'
    ]
  },
  {
    title: 'Energy & Work',
    description: 'Learn about conservation of energy, work calculations, and simple machines.',
    icon: Atom,
    href: '/energy-work',
    features: [
      'Potential/kinetic energy',
      'Work-energy theorem',
      'Simple machines',
      'Energy efficiency'
    ]
  },
  {
    title: 'Waves & Optics',
    description: 'Visualize wave propagation, interference patterns, and optical phenomena.',
    icon: Waves,
    href: '/waves-optics',
    features: [
      'Wave interference',
      'Refraction and reflection',
      'Lens and mirror optics',
      'Doppler effect'
    ]
  },
  {
    title: 'Electricity & Magnetism',
    description: 'Experiment with electric fields, magnetic forces, and circuit building.',
    icon: Zap,
    href: '/electricity-magnetism',
    features: [
      'Electric field visualization',
      'Magnetic field interactions',
      'Circuit simulation',
      'Electromagnetic induction'
    ]
  }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Interactive 3D Physics Simulator
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Explore fundamental physics concepts through immersive, interactive 3D simulations. 
            Learn by doing with scientifically accurate models and real-time visualizations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="gap-2">
              <Play className="h-5 w-5" />
              Start Exploring
            </Button>
            <Button variant="outline" size="lg">
              View Documentation
            </Button>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {modules.map((module, index) => {
            const Icon = module.icon
            return (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="h-8 w-8 text-primary" />
                    <CardTitle className="text-xl">{module.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {module.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {module.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href={module.href} className="block">
                    <Button className="w-full">
                      Explore Module
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Features Section */}
        <div className="bg-card rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Real-time Physics</h3>
              <p className="text-sm text-muted-foreground">
                Accurate physics simulations with real-time calculations and visualizations.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Scale className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Interactive Controls</h3>
              <p className="text-sm text-muted-foreground">
                Adjust parameters, pause, rewind, and experiment with different scenarios.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Atom className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Educational Content</h3>
              <p className="text-sm text-muted-foreground">
                Learn physics concepts with explanations, formulas, and guided tutorials.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Waves className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Data Export</h3>
              <p className="text-sm text-muted-foreground">
                Export simulation data and graphs for analysis and reporting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
