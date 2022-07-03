import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOGIN } from "../config/routes/paths";

export default function Register() {

    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: ""
    })

    function handleInput(e) {
        setUser((user) => ({
            ...user,
            [e.target.name]: e.target.value
        }))
    }

    async function postApi() {

        let requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        }
        await fetch(`http://localhost:3001/newuser`, requestOptions);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        console.log(user);
        await postApi();

        navigate(LOGIN);
    }

    return (
        <div className="container pt-5">
            <div className="row ">
            <div className="col"></div>
                <div className="col-5 align-self-center">
                    <h1 className="mb-3"> Registro de Nuevo Usuario </h1>
                    <p>Por favor, ingresa un nombre de usuario, email y contraseña válidos.</p>
                    <form className="mt-3" onSubmit={handleSubmit}>
                    <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control mb-3"
                                id="floatingName"
                                name="name"
                                onChange={handleInput}
                                placeholder="Nombre de Usuario" />
                            <label for="floatingName">Nombre de Usuario</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="email"
                                className="form-control mb-3"
                                id="floatingEmail"
                                name="email"
                                onChange={handleInput}
                                placeholder="name@example.com" />
                            <label for="floatingEmail">Email </label>
                        </div>
                        <div className="form-floating">
                            <input
                                type="password"
                                className="form-control"
                                id="floatingPassword"
                                name="password"
                                onChange={handleInput}
                                placeholder="Password" />
                            <label for="floatingPassword">Contraseña</label>
                        </div>
                        <button type="submit" className="btn btn-primary mt-3"> Registrar </button>
                    </form>
                </div>
                <div className="col"></div>
            </div>
        </div>
    )
}