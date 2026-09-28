import { useMe } from "../../hooks/auth/useMe";
import { Navigate } from "react-router-dom";

const VerifyAuth = ({ children }: React.PropsWithChildren) => {

    const { data: user, isLoading } = useMe();

    if (isLoading) return <h1>Cargando...</h1>;

    if (!user) return <Navigate to="/ingreso" />

    return children 
    
}

export default VerifyAuth