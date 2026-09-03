const express = require("express")
const app = express()
app.use(express.json())
const alumnosRoutes = require("./routes/alumnos.routes")
app.use("/alumnos", alumnosRoutes)

// Middleware para loguear cada petición
app.use((req, res, next) => {
    console.log(req.method)
    console.log(req.url)
    next()
})

app.listen(3000, () => {
    console.log("Servidor funcionando en http://localhost:3000")
})