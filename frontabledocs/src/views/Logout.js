import { useAuthContext } from "../contexts/AuthContext";

export default function Logout(){

    const {setUserInfo} = useAuthContext();

    function logout(){
        setUserInfo({});
        window.localStorage.removeItem("MY_AUTH_APP");
    }

    return(
        <>
        <h1> Logout </h1>
        <button className="btn btn-primary" onClick={logout}>Cerrar Sesión</button>
        </>
    )
}