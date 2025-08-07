import { Activity, Scale, Atom, Waves, Zap, BarChart3, Users, BookOpen, Sparkles } from 'lucide-react'

export const physicsModules = [
  {
    title: 'Force & Motion',
    href: '/force-motion',
    icon: Activity,
    description: 'Master Newton\'s Laws through interactive simulations of forces, acceleration, and momentum.',
    subtitle: 'Newton\'s Laws of Motion',
    color: 'from-blue-500 to-cyan-500',
    features: ['Interactive force vectors', 'Real-time physics', 'Collision simulations', 'Inclined planes']
  },
  {
    title: 'Pressure & Buoyancy',
    href: '/pressure-buoyancy',
    icon: Scale,
    description: 'Discover Archimedes\' Principle with fluid dynamics and buoyancy experiments.',
    subtitle: 'Archimedes\' Principle',
    color: 'from-purple-500 to-pink-500',
    features: ['Fluid density controls', 'Object submersion', 'Pressure visualization', 'Buoyant force calculations']
  },
  {
    title: 'Energy & Work',
    href: '/energy-work',
    icon: Atom,
    description: 'Explore energy conservation, work calculations, and simple machines.',
    subtitle: 'Conservation of Energy',
    color: 'from-green-500 to-emerald-500',
    features: ['Potential/kinetic energy', 'Work-energy theorem', 'Simple machines', 'Energy efficiency']
  },
  {
    title: 'Waves & Optics',
    href: '/waves-optics',
    icon: Waves,
    description: 'Visualize wave propagation, interference patterns, and optical phenomena.',
    subtitle: 'Wave Phenomena',
    color: 'from-orange-500 to-yellow-500',
    features: ['Wave interference', 'Refraction and reflection', 'Lens optics', 'Doppler effect']
  },
  {
    title: 'Electricity & Magnetism',
    href: '/electricity-magnetism',
    icon: Zap,
    description: 'Experiment with electric fields, magnetic forces, and circuit building.',
    subtitle: 'Electromagnetic Forces',
    color: 'from-red-500 to-rose-500',
    features: ['Electric field visualization', 'Magnetic interactions', 'Circuit simulation', 'Electromagnetic induction']
  }
]

export const features = [
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
