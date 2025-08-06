import express from 'express'
import { createServer } from 'http'

const httpServer=createServer(express())

httpServer.listen(3000, () => console.log('Server running on http://localhost:3000'))