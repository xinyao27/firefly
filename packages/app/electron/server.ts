import http from 'node:http'
import { createHTTPHandler } from '@trpc/server/adapters/standalone'
import { appRouter } from './router'
import 'reflect-metadata'
const handler = createHTTPHandler({
  router: appRouter,
  createContext() {
    return {}
  },
})

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Request-Method', '*')
  res.setHeader('Access-Control-Allow-Methods', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    return res.end()
  }
  handler(req, res)
})

server.listen(5487)
