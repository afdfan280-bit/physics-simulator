'use client'

import { useState, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, Line, Sphere, Box } from '@react-three/drei'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Play, Pause, RotateCcw, Waves } from 'lucide-react'
import * as THREE from 'three'

// Wave visualization
function WaveVisualization({ 
  amplitude, 
  frequency, 
  wavelength, 
  isPlaying 
}: { 
  amplitude: number; 
  frequency: number; 
  wavelength: number; 
  isPlaying: boolean 
}) {
  const [time, setTime] = useState(0)
  
  useFrame(() => {
    if (isPlaying) {
      setTime(prev => prev + 0.05)
    }
  })
  
  const points = []
  const numPoints = 100
  
  for (let i = 0; i <= numPoints; i++) {
    const x = (i / numPoints) * wavelength * 2 - wavelength
    const y = amplitude * Math.sin((2 * Math.PI / wavelength) * x - 2 * Math.PI * frequency * time)
    points.push(new THREE.Vector3(x, y, 0))
  }
  
  return (
    <Line
      points={points}
      color="#3B82F6"
      lineWidth={3}
    />
  )
}

// Interference pattern
function InterferencePattern({ 
  source1, 
  source2, 
  isPlaying 
}: { 
  source1: [number, number, number]; 
  source2: [number, number, number]; 
  isPlaying: boolean 
}) {
  const [time, setTime] = useState(0)
  
  useFrame(() => {
    if (isPlaying) {
      setTime(prev => prev + 0.05)
    }
  })
  
  const points = []
  const gridSize = 20
  const spacing = 0.5
  
  for (let i = 0; i <= gridSize; i++) {
    for (let j = 0; j <= gridSize; j++) {
      const x = (i - gridSize/2) * spacing
      const z = (j - gridSize/2) * spacing
      
      // Calculate distances from sources
      const d1 = Math.sqrt(Math.pow(x - source1[0], 2) + Math.pow(z - source1[2], 2))
      const d2 = Math.sqrt(Math.pow(x - source2[0], 2) + Math.pow(z - source2[2], 2))
      
      // Calculate wave amplitudes
      const a1 = Math.sin(2 * Math.PI * (d1 / 2 - time))
      const a2 = Math.sin(2 * Math.PI * (d2 / 2 - time))
      
      // Superposition
      const amplitude = a1 + a2
      
      if (Math.abs(amplitude) > 0.5) {
        points.push(new THREE.Vector3(x, amplitude * 0.5, z))
      }
    }
  }
  
  return (
    <group>
      {points.map((point, i) => (
        <Sphere key={i} position={point} args={[0.05]}>
          <meshStandardMaterial 
            color={point.y > 0 ? "#FF6B6B" : "#4ECDC4"} 
            transparent 
            opacity={0.7} 
          />
        </Sphere>
      ))}
    </group>
  )
}

// Main component
export default function WavesOpticsPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [amplitude, setAmplitude] = useState([1])
  const [frequency, setFrequency] = useState([1])
  const [wavelength, setWavelength] = useState([2])
  const [tab, setTab] = useState('wave')

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Waves & Optics</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Visualize wave propagation, interference patterns, and optical phenomena through interactive simulations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Waves className="h-5 w-5" />
                  3D Simulation
                </CardTitle>
                <CardDescription>
                  Interactive waves and optics simulation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 rounded-lg overflow-hidden">
                  <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    
                    {tab === 'wave' && (
                      <WaveVisualization 
                        amplitude={amplitude[0]} 
                        frequency={frequency[0]} 
                        wavelength={wavelength[0]} 
                        isPlaying={isPlaying} 
                      />
                    )}
                    
                    {tab === 'interference' && (
                      <InterferencePattern 
                        source1={[-2, 0, 0]} 
                        source2={[2, 0, 0]} 
                        isPlaying={isPlaying} 
                      />
                    )}
                    
                    <OrbitControls />
                  </Canvas>
                </div>
                
                <div className="flex justify-center gap-4 mt-4">
                  <Button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="gap-2"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setIsPlaying(false)
                      setAmplitude([1])
                      setFrequency([1])
                      setWavelength([2])
                    }}
                    className="gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Controls</CardTitle>
                <CardDescription>
                  Adjust simulation parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs value={tab} onValueChange={setTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="wave">Wave</TabsTrigger>
                    <TabsTrigger value="interference">Interference</TabsTrigger>
                    <TabsTrigger value="optics">Optics</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="wave" className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Amplitude: {amplitude[0]}
                      </label>
                      <Slider
                        value={amplitude}
                        onValueChange={setAmplitude}
                        max={3}
                        min={0.1}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Frequency: {frequency[0]} Hz
                      </label>
                      <Slider
                        value={frequency}
                        onValueChange={setFrequency}
                        max={5}
                        min={0.1}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Wavelength: {wavelength[0]} m
                      </label>
                      <Slider
                        value={wavelength}
                        onValueChange={setWavelength}
                        max={5}
                        min={0.5}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="interference" className="space-y-4">
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        Two-source interference pattern
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Red points: constructive interference<br />
                        Blue points: destructive interference
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="optics" className="space-y-4">
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        Optics simulation coming soon
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Information</CardTitle>
                <CardDescription>
                  Physics concepts demonstrated
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Wave Equation</h4>
                  <p className="text-sm text-muted-foreground">
                    y = A sin(kx - ωt)
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Describes wave motion with amplitude A, wave number k, and angular frequency ω.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Wave Properties</h4>
                  <p className="text-sm text-muted-foreground">
                    v = fλ
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Wave speed equals frequency times wavelength.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Interference</h4>
                  <p className="text-sm text-muted-foreground">
                    When waves overlap, they add constructively or destructively.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper hook for frame updates
function useFrame(callback: (state: any, delta: number) => void) {
  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()
  
  useEffect(() => {
    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = (time - previousTimeRef.current) / 1000
        callback({ time }, deltaTime)
      }
      previousTimeRef.current = time
      requestRef.current = requestAnimationFrame(animate)
    }
    
    requestRef.current = requestAnimationFrame(animate)
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [callback])
}
