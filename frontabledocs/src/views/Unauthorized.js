import { useNavigate } from "react-router-dom";

export default function Unauthorized() {

    const navigate = useNavigate();

    function volverAtras(){
        navigate(-1);
    }

    return (
        <div>
            <h1 className="pt-5 mb-3"> Unauthorized </h1>
            <p>Lo sentimos, pero no tiene autorización para entrar en esta página.</p>
            <button className="btn btn-primary" onClick={volverAtras}>Volver </button>
        </div>
    )
}