import { Routes, Route, Outlet, Navigate } from "react-router-dom"
import { Layout } from "@/components/layout"
import { useAuth } from "@/stores/auth"

import LoginPage from "@/pages/LoginPage"
import DashboardPage from "@/pages/DashboardPage"
import AgentesPage from "@/pages/AgentesPage"
import RotinasPage from "@/pages/RotinasPage"
import UsuariosPage from "@/pages/UsuariosPage"
import { UsuariosList } from "@/pages/UsuariosPage/components/usuarios-list"

function ProtectedRoute() {
    const { isAuthenticated } = useAuth()

    // Se não estiver autenticado, redireciona para login
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />
    }

    return (
        <Layout>
            <Outlet />
        </Layout>
    )
}

function RedirectToDashboard() {
    return <Navigate to="/" replace />
}

export default function AppRoutes() {
    return (
        <Routes>
            {/* Rotas privadas agrupadas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute />}>
                <Route index element={<DashboardPage />} />

                {/* Rotas de Agentes */}
                <Route path="/agentes" element={<AgentesPage />} />
                <Route path="/agentes/novo" element={<AgentesPage />} />
                <Route path="/agentes/:id" element={<AgentesPage />} />
                <Route path="/agentes/:id/editar" element={<AgentesPage />} />

                {/* Rotas de Rotinas */}
                <Route path="/rotinas" element={<RotinasPage />} />
                <Route path="/rotinas/nova" element={<RotinasPage />} />
                <Route path="/rotinas/:id" element={<RotinasPage />} />
                <Route path="/rotinas/:id/editar" element={<RotinasPage />} />

                {/* Rotas de Usuários */}
                <Route path="/usuarios" element={<UsuariosList />} />
                <Route path="/usuarios/novo" element={<UsuariosPage />} />
                <Route path="/usuarios/:id" element={<UsuariosPage />} />
                <Route path="/usuarios/:id/editar" element={<UsuariosPage />} />
            </Route>
            <Route path="*" element={<RedirectToDashboard />} />
        </Routes>
    )
}
