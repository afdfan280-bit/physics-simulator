import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { Server } from 'socket.io'
import { setupSocket } from './src/lib/socket'

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3000
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url!, true)
      handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error handling request:', err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  const io = new Server(httpServer)
  setupSocket(io)

  httpServer
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
    .on('error', (err) => {
      console.error('Server error:', err)
      process.exit(1)
    })
})
