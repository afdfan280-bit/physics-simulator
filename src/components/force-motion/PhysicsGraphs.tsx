'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useSimulationStore } from '@/hooks/use-simulation-store'

export function PhysicsGraphs() {
  const { simulationData } = useSimulationStore()

  return (
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
                <XAxis dataKey="time" type="number" domain={['dataMin', 'dataMax']} label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Position (m)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => typeof value === 'number' ? value.toFixed(2) : value} />
                <Line type="monotone" dataKey="position" stroke="#8884d8" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="velocity" className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={simulationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" type="number" domain={['dataMin', 'dataMax']} label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Velocity (m/s)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => typeof value === 'number' ? value.toFixed(2) : value} />
                <Line type="monotone" dataKey="velocity" stroke="#82ca9d" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="acceleration" className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={simulationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" type="number" domain={['dataMin', 'dataMax']} label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Acceleration (m/s²)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => typeof value === 'number' ? value.toFixed(2) : value} />
                <Line type="monotone" dataKey="acceleration" stroke="#ffc658" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
