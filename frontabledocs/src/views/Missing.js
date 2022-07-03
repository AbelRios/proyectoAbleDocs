import { useNavigate } from "react-router-dom"
import { USER_PANEL } from "../config/routes/paths";

export default function Missing() {

    const navigate = useNavigate();

    function volverUserPage() {
        navigate(USER_PANEL);
    }

    return (
        <div className="container justify-content-center">
            <div className="row pt-5">
                <div className="col">
                    <h1 className="mb-3">Oops!</h1>
                    <p>Error 404, la página que buscas no existe. Quizá quieras volver al Inicio.</p>
                    <button className="btn btn-primary" onClick={volverUserPage}>
                        Volver al Inicio
                    </button>
                </div>
            </div>
        </div>
    )
}