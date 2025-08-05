'use client'

import { useState, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics, useBox, useSphere, usePlane } from '@react-three/cannon'
import { OrbitControls, Text, Line, Sphere, Box, Cylinder } from '@react-three/drei'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Play, Pause, RotateCcw, Zap } from 'lucide-react'
import * as THREE from 'three'

// Electric charge component
function ElectricCharge({ position, charge, isPlaying }: { position: [number, number, number]; charge: number; isPlaying: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame(() => {
    if (meshRef.current && isPlaying) {
      // Animate charge pulsing
      const scale = 1 + Math.sin(Date.now() * 0.003) * 0.1
      meshRef.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <Sphere ref={meshRef} position={position} args={[0.3]}>
      <meshStandardMaterial 
        color={charge > 0 ? "#FF4444" : "#4444FF"} 
        emissive={charge > 0 ? "#FF4444" : "#4444FF"}
        emissiveIntensity={0.3}
      />
    </Sphere>
  )
}

// Electric field lines
function ElectricFieldLine({ start, direction, length, steps = 20 }: { 
  start: [number, number, number]; 
  direction: [number, number, number]; 
  length: number; 
  steps?: number 
}) {
  const points = []
  
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const x = start[0] + direction[0] * length * t
    const y = start[1] + direction[1] * length * t
    const z = start[2] + direction[2] * length * t
    points.push(new THREE.Vector3(x, y, z))
  }

  return (
    <Line
      points={points}
      color="#FFD700"
      lineWidth={1}
      transparent
      opacity={0.6}
    />
  )
}

// Main component
export default function ElectricityMagnetismPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [voltage, setVoltage] = useState([12])
  const [resistance, setResistance] = useState([10])
  const [charge1, setCharge1] = useState([1])
  const [charge2, setCharge2] = useState([-1])

  const current = voltage[0] / resistance[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Electricity & Magnetism</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore electric fields, magnetic forces, and circuit behavior through interactive simulations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  3D Simulation
                </CardTitle>
                <CardDescription>
                  Interactive electricity and magnetism simulation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 rounded-lg overflow-hidden">
                  <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    
                    <ElectricCharge position={[-2, 0, 0]} charge={charge1[0]} isPlaying={isPlaying} />
                    <ElectricCharge position={[2, 0, 0]} charge={charge2[0]} isPlaying={isPlaying} />
                    
                    <ElectricFieldLine 
                      start={[-1.5, 0, 0]} 
                      direction={[1, 0, 0]} 
                      length={3} 
                    />
                    
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
                      setVoltage([12])
                      setResistance([10])
                      setCharge1([1])
                      setCharge2([-1])
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
              <CardContent className="space-y-6">
                <Tabs defaultValue="electric" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="electric">Electric</TabsTrigger>
                    <TabsTrigger value="circuit">Circuit</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="electric" className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Charge 1: {charge1[0]}C
                      </label>
                      <Slider
                        value={charge1}
                        onValueChange={setCharge1}
                        max={5}
                        min={-5}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Charge 2: {charge2[0]}C
                      </label>
                      <Slider
                        value={charge2}
                        onValueChange={setCharge2}
                        max={5}
                        min={-5}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="circuit" className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Voltage: {voltage[0]}V
                      </label>
                      <Slider
                        value={voltage}
                        onValueChange={setVoltage}
                        max={24}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Resistance: {resistance[0]}Ω
                      </label>
                      <Slider
                        value={resistance}
                        onValueChange={setResistance}
                        max={100}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm">
                        <strong>Current:</strong> {current.toFixed(2)}A
                      </p>
                      <p className="text-sm">
                        <strong>Power:</strong> {(voltage[0] * current).toFixed(2)}W
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
                  <h4 className="font-semibold mb-2">Coulomb's Law</h4>
                  <p className="text-sm text-muted-foreground">
                    F = k × (q₁ × q₂) / r²
                  </p>
                  <p className="text-sm text-muted-foreground">
                    The force between charges is proportional to the product of their charges and inversely proportional to the square of the distance between them.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Ohm's Law</h4>
                  <p className="text-sm text-muted-foreground">
                    V = I × R
                  </p>
                  <p className="text-sm text-muted-foreground">
                    The voltage across a conductor is directly proportional to the current flowing through it.
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
