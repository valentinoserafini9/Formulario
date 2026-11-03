import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Alert, Box, Button, Paper, TextField, Typography } from "@mui/material"

const API_LOGIN = "http://localhost:3000/auth/login"

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [cargando, setCargando] = useState(false)
    const navigate = useNavigate()

    async function iniciarSesion(e) {
        e.preventDefault()
        setError("")

        if (email.trim() === "" || password === "") {
            setError("Completá el email y la contraseña")
            return
        }

        setCargando(true)
        try {
            const respuesta = await fetch(API_LOGIN, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim(), password })
            })
            const datos = await respuesta.json()

            if (!respuesta.ok) {
                throw new Error(datos.mensaje)
            }

            localStorage.setItem("token", datos.token)
            localStorage.setItem("usuario", JSON.stringify({ nombre: datos.nombre, rol: datos.rol }))
            navigate("/", { replace: true })
        } catch (error) {
            console.error("Error al iniciar sesión:", error)
            setError(error instanceof TypeError
                ? "No se pudo conectar con el servidor"
                : error.message || "No se pudo iniciar sesión")
        } finally {
            setCargando(false)
        }
    }

    return (
        <Box
            component="main"
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                px: 2,
                bgcolor: "background.default",
                color: "text.primary"
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                    component="img"
                    src="/sga-logo.svg"
                    alt="Identidad visual de SGA"
                    sx={{ width: 50, height: 50 }}
                />
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.15 }}>
                        SGA
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Gestión Académica
                    </Typography>
                </Box>
            </Box>
            <Paper
                component="section"
                elevation={0}
                sx={{
                    p: { xs: 2.5, sm: 3.5 },
                    width: "100%",
                    maxWidth: 420,
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 4,
                    bgcolor: "background.paper"
                }}
            >
                <Typography component="h2" variant="h5" sx={{ mb: 2.5, fontWeight: 700 }}>
                    Iniciar sesión
                </Typography>
                <Box
                    component="form"
                    onSubmit={iniciarSesion}
                    noValidate
                    sx={{ display: "grid", gap: 2 }}
                >
                    <TextField
                        id="email"
                        label="Email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        fullWidth
                    />
                    <TextField
                        id="password"
                        label="Contraseña"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        fullWidth
                    />
                    <Button type="submit" variant="contained" disabled={cargando}>
                        {cargando ? "Ingresando..." : "Ingresar"}
                    </Button>
                    {error && (
                        <Alert severity="error" role="alert">
                            {error}
                        </Alert>
                    )}
                </Box>
            </Paper>
        </Box>
    )
}
