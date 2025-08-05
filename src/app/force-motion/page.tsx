'use client'

import { useState, useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Box, Sphere, Plane, Text } from '@react-three/drei'
import { Physics, useBox, usePlane, useSphere } from '@react-three/cannon'
import * as THREE from 'three'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Play, Pause, RotateCcw, Activity } from 'lucide-react'
import { DataExport } from '@/components/DataExport'

// Physics objects
function Ground() {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], position: [0, -2, 0] }))
  return (
    <Plane ref={ref} args={[20, 20]}>
      <meshStandardMaterial color="#90EE90" />
    </Plane>
  )
}

function MovingBox({ position, mass, velocity }: { position: [number, number, number]; mass: number; velocity: [number, number, number] }) {
  const [ref, api] = useBox(() => ({ mass, position, args: [1, 1, 1] }))
  
  useEffect(() => {
    api.velocity.set(...velocity)
  }, [api, velocity])

  return (
    <Box ref={ref} args={[1, 1, 1]}>
      <meshStandardMaterial color="#3B82F6" />
    </Box>
  )
}

function ForceVector({ start, direction, magnitude, color = '#FF0000' }: { 
  start: [number, number, number]; 
  direction: [number, number, number]; 
  magnitude: number; 
  color?: string 
}) {
  const end: [number, number, number] = [
    start[0] + direction[0] * magnitude,
    start[1] + direction[1] * magnitude,
    start[2] + direction[2] * magnitude
  ]

  return (
    <group>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array([...start, ...end])}
            count={2}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} linewidth={3} />
      </line>
      <Sphere position={end} args={[0.1]}>
        <meshStandardMaterial color={color} />
      </Sphere>
    </group>
  )
}

// Main scene component
function PhysicsScene({ 
  mass, 
  force, 
  friction, 
  isPlaying 
}: { 
  mass: number; 
  force: number; 
  friction: number; 
  isPlaying: boolean 
}) {
  const [data, setData] = useState<Array<{ time: number; position: number; velocity: number; acceleration: number }>>([])
  const startTime = useRef(Date.now())
  
  useFrame(() => {
    if (isPlaying) {
      const time = (Date.now() - startTime.current) / 1000
      const acceleration = force / mass
      const velocity = acceleration * time
      const position = 0.5 * acceleration * time * time
      
      setData(prev => {
        const newData = [...prev, { time, position, velocity, acceleration }]
        return newData.slice(-100) // Keep last 100 data points
      })
    }
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Physics gravity={[0, -9.81, 0]}>
        <Ground />
        <MovingBox 
          position={[0, 0, 0]} 
          mass={mass} 
          velocity={[force / mass, 0, 0]} 
        />
        {isPlaying && (
          <ForceVector 
            start={[0, 0, 0]} 
            direction={[1, 0, 0]} 
            magnitude={force / 10} 
          />
        )}
      </Physics>
      <OrbitControls />
      <Text position={[0, 3, 0]} fontSize={0.5} color="black">
        Newton's Second Law: F = ma
      </Text>
    </>
  )
}

export default function ForceMotionPage() {
  const [mass, setMass] = useState([1])
  const [force, setForce] = useState([10])
  const [friction, setFriction] = useState([0.1])
  const [isPlaying, setIsPlaying] = useState(false)
  const [simulationData, setSimulationData] = useState<Array<{ time: number; position: number; velocity: number; acceleration: number }>>([])

  const handleReset = () => {
    setIsPlaying(false)
    setSimulationData([])
  }

  const calculatePhysics = () => {
    const acceleration = force[0] / mass[0]
    return {
      acceleration: acceleration.toFixed(2),
      velocity: (acceleration * 1).toFixed(2), // Velocity after 1 second
      position: (0.5 * acceleration * 1 * 1).toFixed(2) // Position after 1 second
    }
  }

  const physics = calculatePhysics()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Force & Motion</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Explore Newton's Laws of Motion through interactive 3D simulations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D Scene */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                3D Simulation
              </CardTitle>
              <CardDescription>
                Interactive visualization of force and motion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 rounded-lg overflow-hidden bg-gray-100">
                <Canvas camera={{ position: [5, 5, 5], fov: 75 }}>
                  <PhysicsScene 
                    mass={mass[0]} 
                    force={force[0]} 
                    friction={friction[0]} 
                    isPlaying={isPlaying} 
                  />
                </Canvas>
              </div>
              <div className="flex gap-2 mt-4">
                <Button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  variant={isPlaying ? "secondary" : "default"}
                >
                  {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
                <Button onClick={handleReset} variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Simulation Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Mass (kg): {mass[0]}</Label>
                <Slider
                  value={mass}
                  onValueChange={setMass}
                  max={10}
                  min={0.1}
                  step={0.1}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Force (N): {force[0]}</Label>
                <Slider
                  value={force}
                  onValueChange={setForce}
                  max={50}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Friction: {friction[0]}</Label>
                <Slider
                  value={friction}
                  onValueChange={setFriction}
                  max={1}
                  min={0}
                  step={0.01}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Physics Calculations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium">Acceleration</div>
                  <div className="text-2xl font-bold text-blue-600">{physics.acceleration} m/s²</div>
                </div>
                <div>
                  <div className="font-medium">Velocity (1s)</div>
                  <div className="text-2xl font-bold text-green-600">{physics.velocity} m/s</div>
                </div>
                <div>
                  <div className="font-medium">Position (1s)</div>
                  <div className="text-2xl font-bold text-purple-600">{physics.position} m</div>
                </div>
                <div>
                  <div className="font-medium">Net Force</div>
                  <div className="text-2xl font-bold text-red-600">{force[0]} N</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Data Visualization */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Motion Data</CardTitle>
          <CardDescription>
            Real-time graphs of position, velocity, and acceleration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="position" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="position">Position</TabsTrigger>
              <TabsTrigger value="velocity">Velocity</TabsTrigger>
              <TabsTrigger value="acceleration">Acceleration</TabsTrigger>
            </TabsList>
            <TabsContent value="position" className="mt-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={simulationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Position (m)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="position" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="velocity" className="mt-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={simulationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Velocity (m/s)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="velocity" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="acceleration" className="mt-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={simulationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Acceleration (m/s²)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="acceleration" stroke="#ffc658" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Data Export */}
      <DataExport 
        data={simulationData} 
        title="Force and Motion Simulation"
        description="Newton's Second Law simulation data including position, velocity, and acceleration over time."
      />

      {/* Educational Content */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Newton's Laws of Motion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">First Law (Inertia)</h3>
              <p className="text-sm text-muted-foreground">
                An object at rest stays at rest, and an object in motion stays in motion, 
                unless acted upon by an external force.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Second Law (F = ma)</h3>
              <p className="text-sm text-muted-foreground">
                The acceleration of an object is directly proportional to the net force 
                acting on it and inversely proportional to its mass.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Third Law (Action-Reaction)</h3>
              <p className="text-sm text-muted-foreground">
                For every action, there is an equal and opposite reaction.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}