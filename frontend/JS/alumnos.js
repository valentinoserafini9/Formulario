const formulario = document.querySelector("#formAlumno")
const mensaje = document.querySelector("#mensaje")
const listaAlumnos = document.querySelector("#listaAlumnos")
let alumnoEditandoId = null
let alumnoEditar = null
const btnCancelar = document.querySelector("#btnCancelar")
btnCancelar.style.display = "none"
const btnGuardar = document.querySelector("#btnGuardar")

formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    const nombre = document.querySelector("#nombreAlumno").value.trim()
    const carrera = document.querySelector("#carrera").value.trim()

    if (nombre === "" || carrera === "") {
        mostrarMensaje("Todos los campos son obligatorios", "mje-error")
        return
    }

    if (nombre.length < 3) {
        mostrarMensaje("El nombre debe tener al menos 3 caracteres", "mje-error")
        return
    }

    const alumnos = obtenerAlumnos()

    if (alumnoEditandoId === null) {
        const alumno = {
            id: Date.now(),
            nombre: nombre,
            carrera: carrera
        }
        alumnos.push(alumno)
        mostrarMensaje("Alumno guardado correctamente", "mje-exito")
    } else {
        const alumno = alumnos.find(alumno => alumno.id === alumnoEditandoId)
        alumno.nombre = nombre
        alumno.carrera = carrera

        const datosActuales = {
            nombre: nombre,
            carrera: carrera
        }
        if (JSON.stringify(datosActuales) === JSON.stringify(alumnoEditar)) {
            mostrarMensaje("No se realizaron cambios", "mje-error")
            return
        }

        alumnoEditandoId = null
        alumnoEditar = null
        btnGuardar.textContent = "Guardar Alumno"

        mostrarMensaje("Alumno actualizado correctamente", "mje-exito")
    }

    guardarDatos("alumnos", alumnos)
    mostrarAlumnos(alumnos)
    formulario.reset()
    btnCancelar.style.display = "none"
});


function obtenerAlumnos() {
    return obtenerDatos("alumnos")
}


function mostrarAlumnos(alumnos) {
    listaAlumnos.innerHTML = ""
    for (const alumno of alumnos) {
        listaAlumnos.innerHTML += `
        <tr>
            <td>${alumno.id}</td>
            <td>${alumno.nombre}</td>
            <td>${alumno.carrera}</td>
            <td>
                <button 
                class="btn-editar" 
                data-id="${alumno.id}"
                title="Editar alumno">
                <i class="fa-solid fa-pen"></i>
                </button>
                <button 
                class="btn-eliminar" 
                data-id="${alumno.id}"
                title="Eliminar alumno">
                <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
        `;
    }
}

function eliminarAlumno(id) {
    const alumnos = obtenerAlumnos()
    const alumnosActualizados = alumnos.filter(
        alumno => alumno.id !== id
    );
    guardarDatos("alumnos", alumnosActualizados)
    mostrarAlumnos(alumnosActualizados)
    if (alumnoEditandoId === id) {
        formulario.reset()
        alumnoEditandoId = null
        alumnoEditar = null
        btnGuardar.textContent = "Guardar Alumno"
        btnCancelar.style.display = "none"
    }
    mostrarMensaje("Alumno eliminado correctamente", "mje-exito")
}

listaAlumnos.addEventListener("click", (e) => {
    const boton_el = e.target.closest(".btn-eliminar")
    if (boton_el) {
        const id = Number(boton_el.dataset.id)
        const confirmar = confirm("¿Está seguro de eliminar este alumno?")
        if (confirmar) {
            eliminarAlumno(id)
        }
    }
    const boton_ed = e.target.closest(".btn-editar")
    if (boton_ed) {
        const id = Number(boton_ed.dataset.id)
        editarAlumno(id)
    }
})

function editarAlumno(id) {
    const alumnos = obtenerAlumnos()
    const alumno = alumnos.find(alumno => alumno.id === id)
    document.querySelector("#nombreAlumno").value = alumno.nombre;
    document.querySelector("#carrera").value = alumno.carrera;

    alumnoEditar = {
        nombre: alumno.nombre,
        carrera: alumno.carrera
    }

    alumnoEditandoId = id;
    btnGuardar.textContent = "Actualizar Alumno"
    btnCancelar.style.display = "inline-block"
    document.querySelector("#nombreAlumno").focus()
}

function cancelarEdicion() {
    formulario.reset()
    alumnoEditandoId = null
    alumnoEditar = null
    btnGuardar.textContent = "Guardar Alumno"
    btnCancelar.style.display = "none"
    document.querySelector("#nombreAlumno").focus()
}

btnCancelar.addEventListener("click", cancelarEdicion)

const alumnos = obtenerAlumnos()
mostrarAlumnos(alumnos)