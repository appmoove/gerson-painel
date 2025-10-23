import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { useTableData } from "@/hooks/use-table-data";
import { usersApi } from "@/controllers";
import { toast } from "sonner";
import { useAuth } from "@/stores/auth";

export function UsuariosList() {

    const { data, isLoading } = useTableData({
        fetchFn: async () => {
            const response = await usersApi.listUsers(user?.organization_id);
            return {
                data
            }
        }
    })

    const getExtraButton = () => {
        return (
            <Link
                to="/usuarios/novo"
                className="cursor-pointer"
            >
                <Button>
                    Novo Usuário
                    <Plus className="h-4 w-4" />
                </Button>
            </Link>
        )
    }

    const breadcrumbs = [
        { label: 'Dashboard', href: '/' },
        { label: 'Usuários' },
    ];

    return (
        <PageContainer
            title="Usuários"
            subtitle="Gerencie os usuários da sua organização."
            extra={getExtraButton()}
            breadcrumbs={breadcrumbs}
        >
            {/* <UsersTable users={users} /> */}
        </PageContainer>
    );
}
