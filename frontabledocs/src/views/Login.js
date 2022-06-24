import { useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import jwt_decode from "jwt-decode";
import {Link as RouterLink} from "react-router-dom";
import { LOGOUT } from "../config/routes/paths";


export default function Login() {

    const {setUserInfo} = useAuthContext();

    const [userLogin, setUserLogin] = useState({
        email:"",
        password:""
    });

    function handleInput(e){
        setUserLogin((userLogin) => ({
            ...userLogin,
            [e.target.name]:e.target.value
        }))
    }

    async function handleSubmit(e){
        e.preventDefault();

        try{
            let requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userLogin)
            }
            
            const response = await fetch(`http://localhost:3001/login`, requestOptions);

            const data = await response.json();

            window.localStorage.setItem("MY_AUTH_APP", data.token);
            console.log(data);
            setUserInfo(jwt_decode(data.token));


        }catch(err){    
            console.log(err);
        }
    }


    return (
        <div className="container">
            <div className="row">
            <div className="col"></div>
            <div className="col-5">
            <h1> Login </h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label for="inputEmail1" className="form-label">Email address</label>
                    <input 
                        type="email" 
                        id="inputEmail1" 
                        className="form-control"
                        onChange={handleInput}
                        name="email" />
                </div>
                <div className="mb-3">
                    <label for="inputPassword" className="form-label">Password</label>
                    <input 
                        type="password" 
                        id="inputPassword" 
                        className="form-control"
                        onChange={handleInput}
                        name="password" />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
            </div>
            <div className="col"></div>
        </div>
        <RouterLink to={LOGOUT}> Log Out </RouterLink>
        </div>
    )
}