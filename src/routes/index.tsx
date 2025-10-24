import { Routes, Route, Outlet, Navigate } from "react-router-dom"

import { Layout } from "@/components/layout"
import { useAuth } from "@/stores/auth"
import { createLazyComponent } from "@/components/routing"

// Páginas principais
const LazyLoginPage = createLazyComponent(() => import('@/pages/LoginPage'))
const LazyDashboardPage = createLazyComponent(() => import('@/pages/DashboardPage'))
const LazyAgentesPage = createLazyComponent(() => import('@/pages/AgentesPage'))
const LazyRotinasPage = createLazyComponent(() => import('@/pages/RotinasPage'))

// Componentes de usuários
const LazyUsersList = createLazyComponent(() => import('@/pages/UsuariosPage/components').then(module => ({ default: module.UsersList })))
const LazyUserCreateForm = createLazyComponent(() => import('@/pages/UsuariosPage/components').then(module => ({ default: module.UserCreateForm })))
const LazyUserEditForm = createLazyComponent(() => import('@/pages/UsuariosPage/components').then(module => ({ default: module.UserEditForm })))
const LazyUserView = createLazyComponent(() => import('@/pages/UsuariosPage/components').then(module => ({ default: module.UserView })))

import VozesOrganizacaoPage from "@/pages/OrganizationVoicesPage/voices-list"

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
            {/* Rota pública */}
            <Route path="/login" element={<LazyLoginPage />} />

            {/* Rotas privadas agrupadas */}
            <Route path="/" element={<ProtectedRoute />}>
                <Route index element={<LazyDashboardPage />} />

                {/* Rotas de Agentes */}
                <Route path="/agentes" element={<LazyAgentesPage />} />
                <Route path="/agentes/novo" element={<LazyAgentesPage />} />
                <Route path="/agentes/:id" element={<LazyAgentesPage />} />
                <Route path="/agentes/:id/editar" element={<LazyAgentesPage />} />

                {/* Rotas de Rotinas */}
                <Route path="/rotinas" element={<LazyRotinasPage />} />
                <Route path="/rotinas/nova" element={<LazyRotinasPage />} />
                <Route path="/rotinas/:id" element={<LazyRotinasPage />} />
                <Route path="/rotinas/:id/editar" element={<LazyRotinasPage />} />

                {/* Rotas de Usuários */}
                <Route path="/usuarios" element={<LazyUsersList />} />
                <Route path="/usuarios/novo" element={<LazyUserCreateForm />} />
                <Route path="/usuarios/:id" element={<LazyUserView />} />
                <Route path="/usuarios/:id/editar" element={<LazyUserEditForm />} />

                {/* Rotas de Vozes */}
                <Route path="/vozes" element={<VozesOrganizacaoPage />} />
            </Route>

            <Route path="*" element={<RedirectToDashboard />} />
        </Routes>
    )
}
