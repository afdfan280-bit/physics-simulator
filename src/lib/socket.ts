import { Server, Socket } from 'socket.io';

type SimulationState = {
  mass: [number]
  force: [number]
  friction: [number]
  isPlaying: boolean
}

export const setupSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    socket.on('simulation:state:update', (state: SimulationState) => {
      // Broadcast the state update to all other clients
      socket.broadcast.emit('simulation:state:updated', state);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};