'use client'

import { useRef, useImperativeHandle, forwardRef, useCallback, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Box, Sphere, Plane, Text, Arrow } from '@react-three/drei'
import { Physics, useBox, usePlane, useContactMaterial } from '@react-three/cannon'
import * as THREE from 'three'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Pause, RotateCcw, Activity } from 'lucide-react'
import { useSimulationStore } from '@/hooks/use-simulation-store'
import { useSocket } from '@/hooks/use-socket'

// Physics objects
function Ground(props) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], position: [0, -2, 0], material: 'ground', ...props }))
  return (
    <Plane ref={ref} args={[20, 20]}>
      <meshStandardMaterial color="#90EE90" />
    </Plane>
  )
}

const MovingBox = forwardRef(({ mass, force, isPlaying, onDataPoint }, ref) => {
  const [boxRef, api] = useBox(() => ({ mass, position: [0, 0, 0], material: 'box' }))
  const lastVelocity = useRef(0)
  const time = useRef(0)
  const startTime = useRef(0)

  useImperativeHandle(ref, () => ({
    reset: () => {
      api.position.set(0, 0, 0)
      api.velocity.set(0, 0, 0)
      api.angularVelocity.set(0, 0, 0)
      lastVelocity.current = 0
      time.current = 0
      startTime.current = 0
    }
  }))

  useEffect(() => {
    if (isPlaying) {
      if (startTime.current === 0) {
        startTime.current = Date.now()
      }
    }
  }, [isPlaying])


  useFrame((_, delta) => {
    if (isPlaying) {
      api.applyForce([force, 0, 0], [0, 0, 0])
      time.current = (Date.now() - startTime.current) / 1000
    }

    const position = boxRef.current.position.x
    const velocity = api.velocity.get()[0] // More accurate to get from api

    let acceleration = 0
    if (delta > 0) {
      acceleration = (velocity - lastVelocity.current) / delta
    }
    lastVelocity.current = velocity

    onDataPoint({ time: time.current, position, velocity, acceleration })
  })

  return (
    <Box ref={boxRef} args={[1, 1, 1]}>
      <meshStandardMaterial color="#3B82F6" />
    </Box>
  )
})
MovingBox.displayName = 'MovingBox';


function ForceVector({ start, direction, magnitude, color = '#FF0000' }: {
  start: [number, number, number];
  direction: [number, number, number];
  magnitude: number;
  color?: string
}) {
  const vecDirection = new THREE.Vector3(...direction);
  return (
    <Arrow
      position={start}
      direction={vecDirection}
      length={magnitude}
      color={color}
      headWidth={0.5}
      headLength={0.5}
    />
  )
}

// Main scene component
const PhysicsScene = forwardRef(({ mass, force, friction, isPlaying, onDataPoint }, ref) => {
  useContactMaterial('ground', 'box', {
    friction,
    restitution: 0.3,
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Physics gravity={[0, -9.81, 0]}>
        <Ground />
        <MovingBox
          ref={ref}
          mass={mass}
          force={force}
          isPlaying={isPlaying}
          onDataPoint={onDataPoint}
        />
        {isPlaying && force > 0 && (
          <ForceVector
            start={[0, 0.5, 0]}
            direction={[1, 0, 0]}
            magnitude={force / 10}
          />
        )}
      </Physics>
      <OrbitControls />
      <Text position={[0, 3, 0]} fontSize={0.5} color="black" anchorX="center" anchorY="middle">
        Newton's Second Law: F = ma
      </Text>
    </>
  )
})
PhysicsScene.displayName = 'PhysicsScene';


export function Simulation3D() {
    const sceneRef = useRef(null)
    const {
        mass,
        force,
        friction,
        isPlaying,
        setPlaying,
        addSimulationData,
        setLiveData,
        reset,
        setMass,
        setForce,
        setFriction,
    } = useSimulationStore()
    const socket = useSocket()

    // Effect to listen for incoming updates
    useEffect(() => {
        if (!socket) return

        const handleStateUpdate = (newState) => {
            setMass(newState.mass)
            setForce(newState.force)
            setFriction(newState.friction)
            setPlaying(newState.isPlaying)
        }

        socket.on('simulation:state:updated', handleStateUpdate)

        return () => {
            socket.off('simulation:state:updated', handleStateUpdate)
        }
    }, [socket, setMass, setForce, setFriction, setPlaying])

    // Effect to send updates
    useEffect(() => {
        if (socket) {
            const state = { mass, force, friction, isPlaying }
            socket.emit('simulation:state:update', state)
        }
    }, [socket, mass, force, friction, isPlaying])


    const handleReset = () => {
        reset()
        if (sceneRef.current) {
            sceneRef.current.reset()
        }
    }

    const handleDataPoint = useCallback((dataPoint) => {
        setLiveData(dataPoint)
        if (isPlaying) {
            addSimulationData(dataPoint)
        }
    }, [isPlaying, setLiveData, addSimulationData])

    return (
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
                            ref={sceneRef}
                            mass={mass[0]}
                            force={force[0]}
                            friction={friction[0]}
                            isPlaying={isPlaying}
                            onDataPoint={handleDataPoint}
                        />
                    </Canvas>
                </div>
                <div className="flex gap-2 mt-4">
                    <Button
                        onClick={() => setPlaying(!isPlaying)}
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
    )
}
