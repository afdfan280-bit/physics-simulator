'use client'

import { useState, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics, useBox, useSphere, usePlane } from '@react-three/cannon'
import { OrbitControls, Text, Line, Sphere, Box, Cylinder } from '@react-three/drei'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Play, Pause, RotateCcw, Atom } from 'lucide-react'
import * as THREE from 'three'

// Inclined plane
function InclinedPlane({ angle }: { angle: number }) {
  const [ref] = useBox(() => ({ 
    position: [0, -2, 0], 
    rotation: [0, 0, -angle * Math.PI / 180], 
    args: [8, 0.2, 4],
    type: 'Static'
  }))
  
  return (
    <Box ref={ref} args={[8, 0.2, 4]}>
      <meshStandardMaterial color="#8B4513" />
    </Box>
  )
}

// Rolling object
function RollingObject({ 
  position, 
  mass, 
  radius,
  isPlaying,
  angle
}: { 
  position: [number, number, number]; 
  mass: number; 
  radius: number;
  isPlaying: boolean;
  angle: number
}) {
  const [ref, api] = useSphere(() => ({ 
    mass, 
    position, 
    args: [radius],
    linearDamping: 0.1,
    angularDamping: 0.1
  }))
  
  const [kineticEnergy, setKineticEnergy] = useState(0)
  const [potentialEnergy, setPotentialEnergy] = useState(0)
  const [totalEnergy, setTotalEnergy] = useState(0)
  
  useFrame(() => {
    if (ref.current && isPlaying) {
      const pos = ref.current.position
      const vel = ref.current.velocity
      
      // Calculate energies
      const height = Math.max(0, pos.y + 2)
      const pe = mass * 9.81 * height
      const ke = 0.5 * mass * (vel.x * vel.x + vel.y * vel.y + vel.z * vel.z)
      const total = pe + ke
      
      setPotentialEnergy(pe)
      setKineticEnergy(ke)
      setTotalEnergy(total)
    }
  })

  return (
    <>
      <Sphere ref={ref} args={[radius]}>
        <meshStandardMaterial color="#FF6B6B" />
      </Sphere>
      
      {/* Energy indicators */}
      <group position={[position[0] + 2, position[1] + 1, position[2]]}>
        <Text fontSize={0.3} color="blue">
          KE: {kineticEnergy.toFixed(1)}J
        </Text>
        <Text position={[0, -0.4, 0]} fontSize={0.3} color="green">
          PE: {potentialEnergy.toFixed(1)}J
        </Text>
        <Text position={[0, -0.8, 0]} fontSize={0.3} color="purple">
          Total: {totalEnergy.toFixed(1)}J
        </Text>
      </group>
    </>
  )
}

// Simple lever
function LeverSystem() {
  const [ref] = useBox(() => ({ 
    position: [0, 0, 0], 
    rotation: [0, 0, 0], 
    args: [6, 0.1, 1],
    type: 'Static'
  }))
  
  return (
    <group>
      {/* Lever beam */}
      <Box ref={ref} args={[6, 0.1, 1]}>
        <meshStandardMaterial color="#654321" />
      </Box>
      
      {/* Fulcrum */}
      <Cylinder position={[0, -0.5, 0]} args={[0.2, 0.2, 1]} rotation={[Math.PI/2, 0, 0]}>
        <meshStandardMaterial color="#333333" />
      </Cylinder>
      
      {/* Load */}
      <Box position={[-2, 0.5, 0]} args={[0.5, 0.5, 0.5]}>
        <meshStandardMaterial color="#FF4444" />
      </Box>
      
      {/* Effort */}
      <Box position={[2, 0.5, 0]} args={[0.3, 0.3, 0.3]}>
        <meshStandardMaterial color="#4444FF" />
      </Box>
    </group>
  )
}

// Main component
export default function EnergyWorkPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [mass, setMass] = useState([1])
  const [height, setHeight] = useState([3])
  const [angle, setAngle] = useState([30])
  const [sceneType, setSceneType] = useState<'incline' | 'lever' | 'pendulum'>('incline')

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Energy & Work</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore conservation of energy, work calculations, and simple machines through interactive simulations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Atom className="h-5 w-5" />
                  3D Simulation
                </CardTitle>
                <CardDescription>
                  Interactive energy and work simulation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 rounded-lg overflow-hidden">
                  <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <Physics gravity={[0, -9.81, 0]}>
                      {sceneType === 'incline' && (
                        <>
                          <InclinedPlane angle={angle[0]} />
                          <RollingObject 
                            position={[-3, height[0] + 1, 0]} 
                            mass={mass[0]} 
                            radius={0.5}
                            isPlaying={isPlaying}
                            angle={angle[0]}
                          />
                        </>
                      )}
                      {sceneType === 'lever' && <LeverSystem />}
                    </Physics>
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
                      setMass([1])
                      setHeight([3])
                      setAngle([30])
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
                <Tabs defaultValue="incline" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="incline">Incline</TabsTrigger>
                    <TabsTrigger value="lever">Lever</TabsTrigger>
                    <TabsTrigger value="pendulum">Pendulum</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="incline" className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Mass: {mass[0]}kg
                      </label>
                      <Slider
                        value={mass}
                        onValueChange={setMass}
                        max={10}
                        min={0.1}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Height: {height[0]}m
                      </label>
                      <Slider
                        value={height}
                        onValueChange={setHeight}
                        max={5}
                        min={1}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Angle: {angle[0]}°
                      </label>
                      <Slider
                        value={angle}
                        onValueChange={setAngle}
                        max={60}
                        min={0}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="lever" className="space-y-4">
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        Lever simulation ready
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="pendulum" className="space-y-4">
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        Pendulum simulation coming soon
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
                  <h4 className="font-semibold mb-2">Kinetic Energy</h4>
                  <p className="text-sm text-muted-foreground">
                    KE = ½mv²
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Energy of motion, proportional to mass and the square of velocity.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Potential Energy</h4>
                  <p className="text-sm text-muted-foreground">
                    PE = mgh
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Gravitational potential energy, proportional to mass, gravity, and height.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Work-Energy Theorem</h4>
                  <p className="text-sm text-muted-foreground">
                    W = ΔKE
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Work done on an object equals its change in kinetic energy.
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
