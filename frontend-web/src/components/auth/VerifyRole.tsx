import { useMe } from "../../hooks/auth/useMe";
import { Navigate } from "react-router-dom"

const VerifyRole = ({ allowed, children }: React.PropsWithChildren<{ allowed: ("USER" | "ARTIST")[] }>) => {

    const { data: user, isLoading } = useMe();

    if (isLoading) return <h1>Cargando...</h1>;

    if (!user) return <Navigate to="/ingreso" />;

    if (!allowed.includes(user.role)) return <Navigate to="/" />;

    return children
}

export default VerifyRole