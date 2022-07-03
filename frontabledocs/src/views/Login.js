import jwt_decode from "jwt-decode";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { TEST_LINKS, REGISTER, USER_PANEL } from "../config/routes/paths";


export default function Login() {

    const navigate = useNavigate();

    const { userInfo, setUserInfo } = useAuthContext();

    const [userLogin, setUserLogin] = useState({
        email: "",
        password: ""
    });

    function handleInput(e) {
        setUserLogin((userLogin) => ({
            ...userLogin,
            [e.target.name]: e.target.value
        }))
    }

    async function handleSubmit(e) {
        e.preventDefault();
        
        try {
            let requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userLogin)
            }

            const response = await fetch(`http://localhost:3001/login`, requestOptions);

            const data = await response.json();

            window.localStorage.setItem("AUTH_TKN", data.token);

            setUserInfo(jwt_decode(data.token));

            navigate(TEST_LINKS);
            // esto cambiará al userpanel

        } catch (err) {
            console.log(err);
        }

        
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col"></div>
                <div className="col-5">
                    <h1 className="mt-5"><i className="bi bi-clipboard"></i><b>Able</b>Docs</h1>
                    <h2 className="mt-5 mb-3"> Login </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="inputEmail1" className="form-label">Email </label>
                            <input
                                type="email"
                                id="inputEmail1"
                                className="form-control"
                                onChange={handleInput}
                                name="email" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="inputPassword" className="form-label">Contraseña</label>
                            <input
                                type="password"
                                id="inputPassword"
                                className="form-control"
                                onChange={handleInput}
                                name="password" />
                        </div>
                        <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
                    </form>
                </div>
                <div className="col"></div>
            </div>
            <br></br>
            <p>¿Aún no tienes cuenta? Regístrate aquí: <RouterLink to={REGISTER}> Crear cuenta </RouterLink></p>
        </div>
    )
}