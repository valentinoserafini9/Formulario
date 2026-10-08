const mongoose = require("mongoose")

async function conectarBD() {
    const uri = process.env.MONGO_URI
    if (!uri) {
        throw new Error("Falta configurar MONGO_URI en el archivo .env")
    }

    await mongoose.connect(uri)
    console.log("Base de datos conectada")
}

module.exports = conectarBD
