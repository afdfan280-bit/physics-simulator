'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSimulationStore } from '@/hooks/use-simulation-store'

export function LivePhysicsData() {
  const { liveData, force } = useSimulationStore()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Physics Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium">Acceleration</div>
            <div className="text-2xl font-bold text-blue-600">{liveData.acceleration.toFixed(2)} m/s²</div>
          </div>
          <div>
            <div className="font-medium">Velocity</div>
            <div className="text-2xl font-bold text-green-600">{liveData.velocity.toFixed(2)} m/s</div>
          </div>
          <div>
            <div className="font-medium">Position</div>
            <div className="text-2xl font-bold text-purple-600">{liveData.position.toFixed(2)} m</div>
          </div>
          <div>
            <div className="font-medium">Net Force</div>
            <div className="text-2xl font-bold text-red-600">{force[0]} N</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
