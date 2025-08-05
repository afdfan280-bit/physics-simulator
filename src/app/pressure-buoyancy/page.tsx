'use client'

import { useState, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics, useBox, useSphere } from '@react-three/cannon'
import { OrbitControls, Text, Sphere, Box } from '@react-three/drei'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Play, Pause, RotateCcw, Scale } from 'lucide-react'
import * as THREE from 'three'

// Water container
function WaterContainer() {
  const [ref] = useBox(() => ({ 
    position: [0, 0, 0], 
    args: [8, 6, 8],
    type: 'Static'
  }))
  
  return (
    <group>
      {/* Water container walls */}
      <Box ref={ref} args={[8, 6, 8]}>
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.3} wireframe />
      </Box>
      
      {/* Water level */}
      <Box position={[0, -1, 0]} args={[7.8, 4, 7.8]}>
        <meshStandardMaterial color="#4682B4" transparent opacity={0.6} />
      </Box>
      
      {/* Container bottom */}
      <Box position={[0, -3, 0]} args={[8, 0.2, 8]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
    </group>
  )
}

// Floating object
function FloatingObject({ 
  position, 
  mass, 
  density, 
  isPlaying 
}: { 
  position: [number, number, number]; 
  mass: number; 
  density: number; 
  isPlaying: boolean 
}) {
  const [ref, api] = useSphere(() => ({ 
    mass, 
    position, 
    args: [0.5],
    linearDamping: 0.5
  }))
  
  const [submerged, setSubmerged] = useState(false)
  const [buoyantForce, setBuoyantForce] = useState(0)
  
  useFrame(() => {
    if (ref.current) {
      const y = ref.current.position.y
      const waterLevel = 1
      
      // Calculate if object is submerged
      const isSubmerged = y < waterLevel
      setSubmerged(isSubmerged)
      
      // Calculate buoyant force (simplified)
      if (isSubmerged) {
        const waterDensity = 1000 // kg/m³
        const volume = (4/3) * Math.PI * Math.pow(0.5, 3) // sphere volume
        const submergedVolume = volume * Math.min(1, (waterLevel - y + 0.5) / 1)
        const force = waterDensity * 9.81 * submergedVolume
        setBuoyantForce(force)
        
        // Apply buoyant force
        api.applyForce([0, force, 0], [0, 0, 0])
      } else {
        setBuoyantForce(0)
      }
    }
  })

  return (
    <>
      <Sphere ref={ref} args={[0.5]}>
        <meshStandardMaterial 
          color={density < 1000 ? "#FF6B6B" : density > 1000 ? "#4ECDC4" : "#45B7D1"} 
        />
      </Sphere>
      {submerged && (
        <Text 
          position={[position[0] + 1, position[1], position[2]]} 
          fontSize={0.3} 
          color="black"
        >
          Fb: {buoyantForce.toFixed(1)}N
        </Text>
      )}
    </>
  )
}

// Main component
export default function PressureBuoyancyPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [objectDensity, setObjectDensity] = useState([800])
  const [fluidDensity, setFluidDensity] = useState([1000])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Pressure & Buoyancy</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore Archimedes' Principle through fluid simulations and buoyancy experiments.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  3D Simulation
                </CardTitle>
                <CardDescription>
                  Interactive pressure and buoyancy simulation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 rounded-lg overflow-hidden">
                  <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <Physics gravity={[0, -9.81, 0]}>
                      <WaterContainer />
                      <FloatingObject 
                        position={[0, 3, 0]} 
                        mass={objectDensity[0] * (4/3) * Math.PI * Math.pow(0.5, 3)} 
                        density={objectDensity[0]} 
                        isPlaying={isPlaying} 
                      />
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
                      setObjectDensity([800])
                      setFluidDensity([1000])
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
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Object Density: {objectDensity[0]} kg/m³
                  </label>
                  <Slider
                    value={objectDensity}
                    onValueChange={setObjectDensity}
                    max={2000}
                    min={100}
                    step={10}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {objectDensity[0] < 1000 ? "Less dense than water - will float" : 
                     objectDensity[0] > 1000 ? "More dense than water - will sink" : 
                     "Same density as water - neutrally buoyant"}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Fluid Density: {fluidDensity[0]} kg/m³
                  </label>
                  <Slider
                    value={fluidDensity}
                    onValueChange={setFluidDensity}
                    max={2000}
                    min={100}
                    step={10}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {fluidDensity[0] === 1000 ? "Water" : 
                     fluidDensity[0] < 1000 ? "Lighter than water" : 
                     "Denser than water"}
                  </p>
                </div>
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
                  <h4 className="font-semibold mb-2">Archimedes' Principle</h4>
                  <p className="text-sm text-muted-foreground">
                    Fb = ρ × V × g
                  </p>
                  <p className="text-sm text-muted-foreground">
                    The buoyant force equals the weight of the displaced fluid.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Hydrostatic Pressure</h4>
                  <p className="text-sm text-muted-foreground">
                    P = ρ × g × h
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Pressure increases with depth in a fluid.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Buoyancy</h4>
                  <p className="text-sm text-muted-foreground">
                    Objects float when buoyant force exceeds weight.
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
