import { initTRPC } from '@trpc/server'
import { DataBase } from './database'

export const t = initTRPC.create()

export const db = new DataBase('firefly').dataSource
