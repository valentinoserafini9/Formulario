const formulario = document.querySelector("#formulario")
const listaAlumnos = document.querySelector("#listaAlumnos")
const btnCancelar = document.querySelector("#btnCancelar")
const btnGuardar = document.querySelector("#btnGuardar")
const campoLegajo = document.querySelector("#legajo")
const API_ALUMNOS = "http://localhost:3000/alumnos"

let alumnos = []
let alumnoEditandoLegajo = null
let alumnoEditar = null

btnCancelar.style.display = "none"

async function solicitarAlumnos(url = API_ALUMNOS, opciones = {}) {
    const respuesta = await fetch(url, opciones)
    const datos = await respuesta.json()

    if (!respuesta.ok) {
        throw new Error(datos.mensaje || `Error de API (${respuesta.status})`)
    }

    return datos
}

function mostrarAlumnos() {
    listaAlumnos.replaceChildren()

    if (alumnos.length === 0) {
        const fila = document.createElement("tr")
        const celda = document.createElement("td")
        celda.colSpan = 5
        celda.textContent = "No hay alumnos registrados"
        fila.append(celda)
        listaAlumnos.append(fila)
        return
    }

    for (const alumno of alumnos) {
        const fila = document.createElement("tr")
        for (const valor of [alumno.legajo, alumno.nombre, alumno.carrera, alumno.correo]) {
            const celda = document.createElement("td")
            celda.textContent = valor
            fila.append(celda)
        }

        const acciones = document.createElement("td")
        const editar = document.createElement("button")
        editar.className = "btn-editar"
        editar.dataset.legajo = alumno.legajo
        editar.title = "Editar alumno"
        editar.innerHTML = '<i class="fa-solid fa-pen"></i>'

        const eliminar = document.createElement("button")
        eliminar.className = "btn-eliminar"
        eliminar.dataset.legajo = alumno.legajo
        eliminar.title = "Eliminar alumno"
        eliminar.innerHTML = '<i class="fa-solid fa-trash"></i>'

        acciones.append(editar, eliminar)
        fila.append(acciones)
        listaAlumnos.append(fila)
    }
}

async function actualizarListaAlumnos() {
    alumnos = await solicitarAlumnos()
    mostrarAlumnos()
}

function restablecerFormulario() {
    formulario.reset()
    campoLegajo.disabled = false
    alumnoEditandoLegajo = null
    alumnoEditar = null
    btnGuardar.textContent = "Guardar Alumno"
    btnCancelar.style.display = "none"
}

formulario.addEventListener("submit", async (event) => {
    event.preventDefault()

    const legajo = Number(campoLegajo.value)
    const nombre = document.querySelector("#nombre").value.trim()
    const carrera = document.querySelector("#carrera").value.trim()
    const correo = document.querySelector("#correo").value.trim()

    if (!Number.isInteger(legajo) || legajo < 1 || !nombre || !carrera || !correo) {
        mostrarMensaje("Complete todos los campos con datos válidos", "mje-error")
        return
    }
    if (!correo.includes("@")) {
        mostrarMensaje("Ingrese un correo electrónico válido", "mje-error")
        return
    }
    if (nombre.length < 3) {
        mostrarMensaje("El nombre debe tener al menos 3 caracteres", "mje-error")
        return
    }

    const datosActuales = { nombre, carrera, correo }
    if (alumnoEditandoLegajo !== null &&
        JSON.stringify(datosActuales) === JSON.stringify(alumnoEditar)) {
        mostrarMensaje("No se realizaron cambios", "mje-adv")
        return
    }

    btnGuardar.disabled = true
    try {
        if (alumnoEditandoLegajo === null) {
            await solicitarAlumnos(API_ALUMNOS, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ legajo, nombre, carrera, correo })
            })
            mostrarMensaje("Alumno guardado correctamente", "mje-exito")
        } else {
            await solicitarAlumnos(`${API_ALUMNOS}/${alumnoEditandoLegajo}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datosActuales)
            })
            mostrarMensaje("Alumno actualizado correctamente", "mje-exito")
        }

        restablecerFormulario()
        await actualizarListaAlumnos()
    } catch (error) {
        console.error("No se pudo guardar el alumno:", error)
        mostrarMensaje(error.message || "No fue posible realizar la operación", "mje-error")
    } finally {
        btnGuardar.disabled = false
    }
})

listaAlumnos.addEventListener("click", async (event) => {
    const botonEliminar = event.target.closest(".btn-eliminar")
    const botonEditar = event.target.closest(".btn-editar")

    if (botonEliminar) {
        const legajo = Number(botonEliminar.dataset.legajo)
        if (!confirm("¿Está seguro de eliminar este alumno?")) {
            return
        }

        try {
            await solicitarAlumnos(`${API_ALUMNOS}/${legajo}`, { method: "DELETE" })
            if (alumnoEditandoLegajo === legajo) {
                restablecerFormulario()
            }
            await actualizarListaAlumnos()
            mostrarMensaje("Alumno eliminado correctamente", "mje-exito")
        } catch (error) {
            console.error("No se pudo eliminar el alumno:", error)
            mostrarMensaje(error.message || "No se pudo eliminar el alumno", "mje-error")
        }
        return
    }

    if (botonEditar) {
        const legajo = Number(botonEditar.dataset.legajo)
        const alumno = alumnos.find((item) => item.legajo === legajo)
        if (!alumno) {
            mostrarMensaje("Alumno no encontrado", "mje-error")
            return
        }

        campoLegajo.value = alumno.legajo
        campoLegajo.disabled = true
        document.querySelector("#nombre").value = alumno.nombre
        document.querySelector("#carrera").value = alumno.carrera
        document.querySelector("#correo").value = alumno.correo
        alumnoEditar = {
            nombre: alumno.nombre,
            carrera: alumno.carrera,
            correo: alumno.correo
        }
        alumnoEditandoLegajo = alumno.legajo
        btnGuardar.textContent = "Actualizar Alumno"
        btnCancelar.style.display = "inline-block"
        document.querySelector("#nombre").focus()
    }
})

btnCancelar.addEventListener("click", restablecerFormulario)

actualizarListaAlumnos().catch((error) => {
    console.error("No se pudo cargar la lista de alumnos:", error)
    mostrarMensaje(error.message || "No se pudo cargar la lista de alumnos", "mje-error")
})
