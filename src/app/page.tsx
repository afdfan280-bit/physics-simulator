'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Activity, Scale, Atom, Waves, Zap, Play, ArrowRight, Sparkles, BarChart3, Users, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'

const modules = [
  {
    title: 'Force & Motion',
    description: 'Master Newton\'s Laws through interactive simulations of forces, acceleration, and momentum.',
    icon: Activity,
    href: '/force-motion',
    color: 'from-blue-500 to-cyan-500',
    features: ['Interactive force vectors', 'Real-time physics', 'Collision simulations', 'Inclined planes']
  },
  {
    title: 'Pressure & Buoyancy',
    description: 'Discover Archimedes\' Principle with fluid dynamics and buoyancy experiments.',
    icon: Scale,
    href: '/pressure-buoyancy',
    color: 'from-purple-500 to-pink-500',
    features: ['Fluid density controls', 'Object submersion', 'Pressure visualization', 'Buoyant force calculations']
  },
  {
    title: 'Energy & Work',
    description: 'Explore energy conservation, work calculations, and simple machines.',
    icon: Atom,
    href: '/energy-work',
    color: 'from-green-500 to-emerald-500',
    features: ['Potential/kinetic energy', 'Work-energy theorem', 'Simple machines', 'Energy efficiency']
  },
  {
    title: 'Waves & Optics',
    description: 'Visualize wave propagation, interference patterns, and optical phenomena.',
    icon: Waves,
    href: '/waves-optics',
    color: 'from-orange-500 to-yellow-500',
    features: ['Wave interference', 'Refraction and reflection', 'Lens optics', 'Doppler effect']
  },
  {
    title: 'Electricity & Magnetism',
    description: 'Experiment with electric fields, magnetic forces, and circuit building.',
    icon: Zap,
    href: '/electricity-magnetism',
    color: 'from-red-500 to-rose-500',
    features: ['Electric field visualization', 'Magnetic interactions', 'Circuit simulation', 'Electromagnetic induction']
  }
]

const features = [
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description: 'Live data visualization and performance metrics'
  },
  {
    icon: Users,
    title: 'Interactive Learning',
    description: 'Hands-on experiments with immediate feedback'
  },
  {
    icon: BookOpen,
    title: 'Educational Content',
    description: 'Comprehensive explanations and guided tutorials'
  },
  {
    icon: Sparkles,
    title: 'Modern UI/UX',
    description: 'Intuitive interface with smooth animations'
  }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 md:py-32">
        <div className="absolute inset-0 bg-grid-slate-200 dark:bg-grid-slate-700 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,#000,rgba(0,0,0,0.6))]" />
        
        <div className="relative mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mb-6 flex items-center justify-center gap-2">
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Interactive Physics Platform
              </span>
            </div>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-6xl lg:text-7xl">
              <span className="block">Interactive 3D</span>
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Physics Simulator
              </span>
            </h1>
            
            <p className="mx-auto mb-10 max-w-3xl text-lg text-slate-600 dark:text-slate-300 md:text-xl">
              Explore fundamental physics concepts through immersive, interactive 3D simulations. 
              Learn by doing with scientifically accurate models and real-time visualizations.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Play className="h-5 w-5" />
                Start Exploring
              </Button>
              <Button variant="outline" size="lg" className="gap-2 border-slate-200 dark:border-slate-700">
                View Documentation
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
              Why Choose Our Platform?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              Experience physics education reimagined with cutting-edge technology and intuitive design.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="group rounded-xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg dark:bg-slate-800"
              >
                <div className="mb-4 rounded-lg bg-slate-100 p-3 dark:bg-slate-700">
                  <feature.icon className="h-6 w-6 text-slate-600 dark:text-slate-300" />
                </div>
                <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
              Physics Modules
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              Dive deep into specific physics concepts with our specialized interactive modules.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((module, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="group"
              >
                <Link href={module.href}>
                  <Card className="h-full overflow-hidden border-0 bg-white shadow-sm transition-all duration-300 hover:shadow-xl dark:bg-slate-800">
                    <div className={`h-2 bg-gradient-to-r ${module.color}`} />
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`rounded-lg bg-gradient-to-br ${module.color} p-3`}>
                          <module.icon className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-xl text-slate-900 dark:text-white">
                          {module.title}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-base text-slate-600 dark:text-slate-300">
                        {module.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                        {module.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600">
                        Explore Module
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 p-8 text-center text-white md:p-12"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Ready to Explore Physics?
            </h2>
            <p className="mb-8 text-lg text-blue-100">
              Join thousands of students and educators who are already using our platform to make physics engaging and interactive.
            </p>
            <Button size="lg" variant="secondary" className="gap-2 bg-white text-blue-600 hover:bg-slate-100">
              <Play className="h-5 w-5" />
              Get Started Now
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
