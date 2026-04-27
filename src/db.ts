import {Client} from 'pg'

export const pgClient = new Client(
    process.env.DATABASE_URL
)

export async function connectDB(){
    await pgClient.connect()
    console.log('Postgres connected')
}