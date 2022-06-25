import { useNavigate } from "react-router-dom"
import { USER_PANEL } from "../config/routes/paths";

export default function Missing(){

    const navigate = useNavigate();

    function volverUserPage(){
        navigate(USER_PANEL);
    }

    return(
        <article>
        <h1>Oops!</h1>
        <p>Error 404, la página que buscas No Existe!</p>
        <button className="btn btn-primary" onClick={volverUserPage}>
            Vuelve al Inicio
        </button>
    </article>
    )
}