'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { useSimulationStore } from '@/hooks/use-simulation-store'

export function SimulationControls() {
  const { mass, force, friction, setMass, setForce, setFriction } = useSimulationStore()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Simulation Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Mass (kg): {mass[0].toFixed(1)}</Label>
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
          <Label>Friction: {friction[0].toFixed(2)}</Label>
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
  )
}
