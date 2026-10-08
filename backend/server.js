require("dotenv").config()

const express = require("express")
const cors = require("cors")
const app = express()

app.use(express.json())
app.use(cors())

const alumnosRoutes = require("./routes/alumnos.routes")
app.use("/alumnos", alumnosRoutes)
const conectarDB = require("./config/database")

const port = Number(process.env.PORT || 3000)
if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT debe ser un número entre 1 y 65535")
}

async function iniciarServidor() {
    try {
        await conectarDB()
        app.listen(port, () => {
            console.log(`Servidor funcionando en http://localhost:${port}`)
        })
    } catch (error) {
        console.error("No se pudo iniciar el servidor:", error)
        process.exitCode = 1
    }
}

iniciarServidor()