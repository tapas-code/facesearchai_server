require('dotenv').config()
const express = require('express')
const cors = require('cors')
const stripeRoutes = require("./routes/stripe");

const app = express()
const PORT = process.env.PORT || 8080;

app.use(express.json())
app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use("/api/stripe", stripeRoutes);

app.get('/', (req, res)=>{
    res.send('SERVER RUNNING.')
})

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
})