import { useMe } from "../../hooks/auth/useMe";
import { Navigate } from "react-router-dom"
import Loader from "../ui/Loader";

const VerifyRole = ({ allowed, children }: React.PropsWithChildren<{ allowed: ("USER" | "ARTIST")[] }>) => {

    const { data: user, isLoading } = useMe();

    if (isLoading) return <div className="flex min-h-svh items-center justify-center bg-green"><Loader /></div>;

    if (!user) return <Navigate to="/ingreso" />;

    if (!allowed.includes(user.role)) return <Navigate to="/" />;

    return children
}

export default VerifyRole