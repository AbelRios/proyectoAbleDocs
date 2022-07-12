import { useNavigate } from "react-router-dom"
import { USER_PANEL } from "../config/routes/paths";

export default function Missing() {

    const navigate = useNavigate();

    function volverUserPage() {
        navigate(USER_PANEL);
    }

    return (
        <div className="container justify-content-center">
            <div className="row justify-content-center pt-5">
                <div className="col-6">
                    <h1 className="text-center mb-3">Oops!</h1>
                    <p className="text-center">Error 404, la página que buscas no existe. Quizá quieras volver al Inicio.</p>
                    <div className="row justify-content-center">
                        <div className="text-center">
                            <button className="btn btn-primary" onClick={volverUserPage}>
                                Volver al Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}