import { ListaMaterias } from "../components/ListaMaterias"
import { useState } from "react"
import { Alert } from "@mui/material"
import FormularioMateria from "../components/FormularioMateria"

export default function Materias() {
const [actualizar, setActualizar] = useState(0)
const [materiaEditar, setMateriaEditar] = useState(null)
const [aviso, setAviso] = useState(null)

function operacionExitosa(mensaje) {
  setActualizar(valor => valor + 1)
  setAviso({ tipo: "success", mensaje })
}

function materiaGuardada(mensaje) {
  setMateriaEditar(null)
  operacionExitosa(mensaje)
}

function materiaEliminada(codigo, mensaje) {
  setMateriaEditar(actual => actual?.codigo === codigo ? null : actual)
  operacionExitosa(mensaje)
}

function mostrarError(mensaje) {
  setAviso({ tipo: "error", mensaje })
}

function seleccionarMateria(materia) {
  setMateriaEditar(materia)
  setAviso(null)
}

return (
   <>
   {aviso && (
    <Alert severity={aviso.tipo} onClose={() => setAviso(null)} sx={{ mb: 3 }}>
      {aviso.mensaje}
    </Alert>
   )}
   <FormularioMateria key={materiaEditar?.codigo ?? "nuevo"}
   onMateriaGuardada={materiaGuardada}
   materiaEditar={materiaEditar}
   onCancelar={() => setMateriaEditar(null)}
   />
   <ListaMaterias
   actualizar={actualizar}
   onMateriaEliminada={materiaEliminada}
   onEditarMateria={seleccionarMateria}
   onError={mostrarError}
   />
  </>
  )
}
