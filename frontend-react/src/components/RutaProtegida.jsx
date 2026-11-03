import { Navigate, Outlet } from "react-router-dom"

function sesionVigente() {
    const token = localStorage.getItem("token")
    if (!token) {
        return false
    }
    try {
        const datos = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")))
        return datos.exp * 1000 > Date.now()
    } catch {
        return false
    }
}

export default function RutaProtegida() {
    if (!sesionVigente()) {
        localStorage.removeItem("token")
        localStorage.removeItem("usuario")
        return <Navigate to="/login" replace />
    }
    return <Outlet />
}
