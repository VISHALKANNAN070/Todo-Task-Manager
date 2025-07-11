import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './models/db.js'
import passport from './auth/passportAuth.js'
import authRoutes from './routes/authRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import cookieParser from 'cookie-parser'


dotenv.config();
connectDB()
const app = express()

app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true,
}))

app.use(express.json())

app.use(cookieParser())

app.use(passport.initialize())

app.use('/api/auth',authRoutes)
app.use('/api/task',taskRoutes)

app.get('/',(req,res)=>{
    res.send("Server is running...")
})

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>console.log(`Server is running at port : ${PORT}`))
