const API_MATERIAS = "http://localhost:3000/materias"
const CODIGO = "CONC1"
const CANTIDAD = 5

const materia = {
    codigo: CODIGO,
    nombre: "Prueba de concurrencia",
    cargaHoraria: 10,
    estado: "activa"
}

function registrar() {
    return fetch(API_MATERIAS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(materia)
    })
}

async function probarConcurrencia() {
    try {
        const previa = await fetch(`${API_MATERIAS}/${CODIGO}`)
        if (previa.ok) {
            console.log(`La materia ${CODIGO} ya existe. Eliminala antes de correr la prueba.`)
            return
        }

        console.log(`Enviando ${CANTIDAD} POST simultáneos con el código ${CODIGO}...`)
        const respuestas = await Promise.all(
            Array.from({ length: CANTIDAD }, registrar)
        )

        for (const [indice, respuesta] of respuestas.entries()) {
            const datos = await respuesta.json()
            console.log(`Pedido ${indice + 1}: ${respuesta.status} - ${datos.mensaje ?? "materia registrada"}`)
        }

        const creadas = respuestas.filter(respuesta => respuesta.status === 201).length
        console.log(`Materias registradas: ${creadas} de ${CANTIDAD}`)

        const borrado = await fetch(`${API_MATERIAS}/${CODIGO}`, { method: "DELETE" })
        console.log(`Limpieza: DELETE ${CODIGO} - ${borrado.status}`)
    } catch (error) {
        console.error("No se pudo conectar con el servidor. Verificá que el backend esté funcionando.")
    }
}

probarConcurrencia()
