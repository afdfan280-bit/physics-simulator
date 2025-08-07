import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const newSocket = io()
    setSocket(newSocket)

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id)
    })

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected')
    })

    return () => {
      newSocket.disconnect()
    }
  }, [])

  return socket
}
