import { useState } from "react";
import { Alert, Box, Button, MenuItem, Paper, TextField, Typography } from "@mui/material"
const API_MATERIAS = "http://localhost:3000/materias"

const FORMULARIO_VACIO = {
    codigo: "",
    nombre: "",
    descripcion: "",
    cargaHoraria: "",
    estado: "activa"
}

function validar(formulario) {
    const errores = {}
    if (formulario.codigo.trim() === "") {
        errores.codigo = "El código es obligatorio"
    }
    if (formulario.nombre.trim() === "") {
        errores.nombre = "El nombre es obligatorio"
    } else if (formulario.nombre.trim().length < 3) {
        errores.nombre = "El nombre debe tener al menos 3 caracteres"
    }
    if (formulario.descripcion.length > 0 && formulario.descripcion.trim() === "") {
        errores.descripcion = "La descripción no puede contener solo espacios"
    }
    if (formulario.cargaHoraria.trim() === "") {
        errores.cargaHoraria = "La carga horaria es obligatoria"
    } else if (!/^\d+$/.test(formulario.cargaHoraria.trim()) || Number(formulario.cargaHoraria) <= 0) {
        errores.cargaHoraria = "Debe ser un número entero mayor que cero"
    }
    if (!["activa", "inactiva"].includes(formulario.estado)) {
        errores.estado = "Seleccioná un estado válido"
    }
    return errores
}

function FormularioMateria({ onMateriaGuardada, materiaEditar, onCancelar }){
    const [formulario, setFormulario] = useState({
        codigo: materiaEditar?.codigo ?? "",
        nombre: materiaEditar?.nombre ?? "",
        descripcion: materiaEditar?.descripcion ?? "",
        cargaHoraria: String(materiaEditar?.cargaHoraria ?? ""),
        estado: materiaEditar?.estado ?? "activa"
    })
    const [errores, setErrores] = useState({})
    const [error, setError] = useState("")
    const [guardando, setGuardando] = useState(false)

    function manejarCambio(e) {
        const { name, value } = e.target

        setFormulario({
            ...formulario,
            [name]: value
        })
        setErrores({
            ...errores,
            [name]: ""
        })
    }

    async function guardar(e) {
        e.preventDefault()
        setError("")

        const erroresValidacion = validar(formulario)
        setErrores(erroresValidacion)
        if (Object.keys(erroresValidacion).length > 0) {
            return
        }

        setGuardando(true)

        const materia = {
            codigo: formulario.codigo.trim().toUpperCase(),
            nombre: formulario.nombre.trim(),
            descripcion: formulario.descripcion.trim(),
            cargaHoraria: Number(formulario.cargaHoraria),
            estado: formulario.estado
        }
        const editando = Boolean(materiaEditar)
        const url = editando
                    ? `${API_MATERIAS}/${encodeURIComponent(materiaEditar.codigo)}`
                    : API_MATERIAS
        try {
            const respuesta = await fetch(url, {
                method: editando ? "PUT" : "POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify(materia)
            })
            const datos = await respuesta.json().catch(() => null)

            if (!respuesta.ok) {
                throw new Error(datos?.mensaje || `No se pudo guardar la materia. Estado HTTP: ${respuesta.status}`)
            }

            setFormulario(FORMULARIO_VACIO)
            onMateriaGuardada(editando
                ? `Materia ${materia.codigo} modificada correctamente`
                : `Materia ${materia.codigo} registrada correctamente`)
        } catch (error) {
            console.error("Error al guardar:", error)
            setError(error instanceof TypeError
                ? "No se pudo conectar con el servidor"
                : error.message)
        } finally {
            setGuardando(false)
        }
    }
    function cancelar(){
        onCancelar()
    }
    return(
        <Paper
            component="section"
            elevation={0}
            sx={{
                p: { xs: 2.5, sm: 3.5 },
                mb: 3,
                border: 1,
                borderColor: "divider",
                borderRadius: 4,
                bgcolor: "background.paper"
            }}
        >
            <Typography component="h2" variant="h5" sx={{ mb: 2.5, fontWeight: 700 }}>
                {materiaEditar ? "Editar materia" : "Nueva Materia"}
            </Typography>
            <Box
                component="form"
                onSubmit={guardar}
                noValidate
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
                    gap: 2
                }}
            >
                <TextField
                    id="codigo"
                    name="codigo"
                    label="Código"
                    value={formulario.codigo}
                    onChange={manejarCambio}
                    error={Boolean(errores.codigo)}
                    helperText={errores.codigo}
                    required
                    fullWidth
                />
                <TextField
                    id="nombre"
                    name="nombre"
                    label="Nombre"
                    value={formulario.nombre}
                    onChange={manejarCambio}
                    error={Boolean(errores.nombre)}
                    helperText={errores.nombre}
                    required
                    fullWidth
                />
                <TextField
                    id="cargaHoraria"
                    name="cargaHoraria"
                    label="Carga horaria"
                    type="number"
                    value={formulario.cargaHoraria}
                    onChange={manejarCambio}
                    error={Boolean(errores.cargaHoraria)}
                    helperText={errores.cargaHoraria}
                    slotProps={{ htmlInput: { min: 1, step: 1 } }}
                    required
                    fullWidth
                />
                <TextField
                    id="estado"
                    name="estado"
                    label="Estado"
                    select
                    value={formulario.estado}
                    onChange={manejarCambio}
                    error={Boolean(errores.estado)}
                    helperText={errores.estado}
                    required
                    fullWidth
                >
                    <MenuItem value="activa">Activa</MenuItem>
                    <MenuItem value="inactiva">Inactiva</MenuItem>
                </TextField>
                <TextField
                    id="descripcion"
                    name="descripcion"
                    label="Descripción"
                    value={formulario.descripcion}
                    onChange={manejarCambio}
                    error={Boolean(errores.descripcion)}
                    helperText={errores.descripcion}
                    multiline
                    minRows={2}
                    fullWidth
                    sx={{ gridColumn: "1 / -1" }}
                />
                <Box
                    sx={{
                        gridColumn: "1 / -1",
                        display: "flex",
                        justifyContent: "flex-end",
                        flexWrap: "wrap",
                        gap: 1.5,
                        mt: 1
                    }}
                >
                    <Button type="submit" variant="contained" disabled={guardando}>
                        {guardando
                            ? "Guardando..."
                            : materiaEditar
                                ? "Guardar cambios"
                                : "Guardar"}
                    </Button>
                    {materiaEditar && (
                        <Button
                            type="button"
                            onClick={cancelar}
                            disabled={guardando}
                            variant="outlined"
                        >
                            Cancelar
                        </Button>
                    )}
                </Box>
                {error && (
                    <Alert severity="error" role="alert" sx={{ gridColumn: "1 / -1" }}>
                        {error}
                    </Alert>
                )}
            </Box>
        </Paper>
    )
}
export default FormularioMateria
