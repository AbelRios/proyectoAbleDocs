import { useState } from "react";

export default function Register() {

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
    }

    return (
        <div className="container">
            <h1 className="m-3"> Registro de Nuevo Usuario </h1>
            <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                    <input
                        type="email"
                        className="form-control mb-3"
                        id="floatingEmail"
                        name="email"
                        onChange={handleInput}
                        placeholder="name@example.com" />
                    <label for="floatingEmail">Email address</label>
                </div>
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
                <div className="form-floating">
                    <input
                        type="password"
                        className="form-control"
                        id="floatingPassword"
                        name="password"
                        onChange={handleInput}
                        placeholder="Password" />
                    <label for="floatingPassword">Password</label>
                </div>
                <button type="submit" className="btn btn-primary mt-3"> Registrar </button>
            </form>
        </div>
    )
}