'use client'

import { DataExport } from '@/components/DataExport'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Simulation3D } from '@/components/force-motion/Simulation3D'
import { SimulationControls } from '@/components/force-motion/SimulationControls'
import { LivePhysicsData } from '@/components/force-motion/LivePhysicsData'
import { PhysicsGraphs } from '@/components/force-motion/PhysicsGraphs'
import { useSimulationStore } from '@/hooks/use-simulation-store'

export default function ForceMotionPage() {
  const { simulationData } = useSimulationStore()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Force & Motion</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Explore Newton's Laws of Motion through interactive 3D simulations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Simulation3D />
        </div>

        <div className="space-y-6">
          <SimulationControls />
          <LivePhysicsData />
        </div>
      </div>

      <PhysicsGraphs />

      <DataExport 
        data={simulationData} 
        title="Force and Motion Simulation"
        description="Newton's Second Law simulation data including position, velocity, and acceleration over time."
      />

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