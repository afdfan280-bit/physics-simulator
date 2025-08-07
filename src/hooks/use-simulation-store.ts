import { create } from 'zustand'

type SimulationState = {
  mass: [number]
  force: [number]
  friction: [number]
  isPlaying: boolean
  simulationData: Array<{ time: number; position: number; velocity: number; acceleration: number }>
  liveData: { position: number; velocity: number; acceleration: number }
}

type SimulationActions = {
  setMass: (mass: [number]) => void
  setForce: (force: [number]) => void
  setFriction: (friction: [number]) => void
  setPlaying: (isPlaying: boolean) => void
  addSimulationData: (dataPoint: { time: number; position: number; velocity: number; acceleration: number }) => void
  setLiveData: (dataPoint: { position: number; velocity: number; acceleration: number }) => void
  reset: () => void
}

const initialState: SimulationState = {
  mass: [1],
  force: [10],
  friction: [0.1],
  isPlaying: false,
  simulationData: [],
  liveData: { position: 0, velocity: 0, acceleration: 0 },
}

export const useSimulationStore = create<SimulationState & SimulationActions>()((set) => ({
  ...initialState,
  setMass: (mass) => set({ mass }),
  setForce: (force) => set({ force }),
  setFriction: (friction) => set({ friction }),
  setPlaying: (isPlaying) => set({ isPlaying }),
  addSimulationData: (dataPoint) => set((state) => ({
    simulationData: [...state.simulationData, dataPoint].slice(-300)
  })),
  setLiveData: (liveData) => set({ liveData }),
  reset: () => set(initialState),
}))
