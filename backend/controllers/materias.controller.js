const Materia = require("../models/Materia")

const ESTADOS = ["activa", "inactiva"]

function normalizarCodigo(codigo) {
    return String(codigo).trim().toUpperCase()
}

function validarMateria({ codigo, nombre, descripcion, cargaHoraria, estado }) {
    if (codigo === undefined || nombre === undefined || cargaHoraria === undefined || estado === undefined) {
        return "Código, nombre, carga horaria y estado son obligatorios"
    }
    if (typeof codigo !== "string") {
        return "El código debe ser un texto"
    }
    if (codigo.trim() === "") {
        return "El código no puede estar vacío"
    }
    if (!/[a-z]/i.test(codigo)) {
        return "El código debe contener al menos una letra"
    }
    if (typeof nombre !== "string" || nombre.trim() === "") {
        return "El nombre no puede estar vacío"
    }
    if (nombre.trim().length < 3 || nombre.trim().length > 100) {
        return "El nombre debe tener entre 3 y 100 caracteres"
    }
    if (descripcion !== undefined) {
        if (typeof descripcion !== "string") {
            return "La descripción debe ser un texto"
        }
        if (descripcion.length > 0 && descripcion.trim() === "") {
            return "La descripción no puede contener únicamente espacios"
        }
    }
    if (typeof cargaHoraria !== "number" || !Number.isInteger(cargaHoraria) || cargaHoraria <= 0) {
        return "La carga horaria debe ser un número entero mayor que cero"
    }
    if (!ESTADOS.includes(estado)) {
        return "El estado solo puede ser activa o inactiva"
    }
    return null
}

function manejarError(res, error) {
    if (error.code === 11000) {
        return res.status(409).json({
            mensaje: "Ya existe una materia con ese código"
        })
    }
    if (error.name === "ValidationError") {
        const primerError = Object.values(error.errors)[0]
        return res.status(400).json({
            mensaje: primerError.message
        })
    }
    console.error(error)
    res.status(500).json({
        mensaje: "No se pudo completar la operación en la base de datos"
    })
}

async function obtenerMaterias(req, res) {
    try {
        const materias = await Materia.find().sort({ codigo: 1 })
        res.json(materias)
    } catch (error) {
        manejarError(res, error)
    }
}

async function obtenerMateria(req, res) {
    try {
        const materia = await Materia.findOne({
            codigo: normalizarCodigo(req.params.codigo)
        })
        if (!materia) {
            return res.status(404).json({
                mensaje: "Materia no encontrada"
            })
        }
        res.json(materia)
    } catch (error) {
        manejarError(res, error)
    }
}

async function crearMateria(req, res) {
    const mensajeError = validarMateria(req.body)
    if (mensajeError) {
        return res.status(400).json({
            mensaje: mensajeError
        })
    }
    const { codigo, nombre, descripcion, cargaHoraria, estado } = req.body
    try {
        const existe = await Materia.findOne({
            codigo: normalizarCodigo(codigo)
        })
        if (existe) {
            return res.status(409).json({
                mensaje: "Ya existe una materia con ese código"
            })
        }
        const nuevaMateria = await Materia.create({
            codigo,
            nombre,
            descripcion,
            cargaHoraria,
            estado
        })
        res.status(201).json(nuevaMateria)
    } catch (error) {
        manejarError(res, error)
    }
}

async function actualizarMateria(req, res) {
    const mensajeError = validarMateria(req.body)
    if (mensajeError) {
        return res.status(400).json({
            mensaje: mensajeError
        })
    }
    const { codigo, nombre, descripcion, cargaHoraria, estado } = req.body
    try {
        const materia = await Materia.findOne({
            codigo: normalizarCodigo(req.params.codigo)
        })
        if (!materia) {
            return res.status(404).json({
                mensaje: "Materia no encontrada"
            })
        }
        const nuevoCodigo = normalizarCodigo(codigo)
        if (nuevoCodigo !== materia.codigo) {
            const existe = await Materia.findOne({ codigo: nuevoCodigo })
            if (existe) {
                return res.status(409).json({
                    mensaje: "Ya existe otra materia con ese código"
                })
            }
        }
        materia.set({
            codigo,
            nombre,
            descripcion: descripcion ?? "",
            cargaHoraria,
            estado
        })
        await materia.save()
        res.json(materia)
    } catch (error) {
        manejarError(res, error)
    }
}

async function eliminarMateria(req, res) {
    try {
        const materia = await Materia.findOneAndDelete(
            { codigo: normalizarCodigo(req.params.codigo) }
        )
        if (!materia) {
            return res.status(404).json({
                mensaje: "Materia no encontrada"
            })
        }
        res.json({ mensaje: "Materia eliminada correctamente" })
    } catch (error) {
        manejarError(res, error)
    }
}

module.exports = {
    obtenerMaterias,
    obtenerMateria,
    crearMateria,
    actualizarMateria,
    eliminarMateria
}
