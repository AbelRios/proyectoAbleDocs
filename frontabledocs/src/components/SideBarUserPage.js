import ListCardsSidebar from "./ListCardsSidebar";
import { useAuthContext } from "../contexts/AuthContext";
import { useState } from "react";
import jwt_decode from "jwt-decode";


export default function SideBarUserPage({ docPage, userInfo, usersList, lista }) {

    const { setUserInfo } = useAuthContext();

    const { id, exp, iat, ...rest } = userInfo;
    const [userAux, setUserAux] = useState(rest);
    const [notificationList, setNotificationList] = useState(userInfo.notifications.slice((userInfo.notifications.length - 2), (userInfo.notifications.length)))


    function handleInput(e) {
        setUserAux((userAux) => ({
            ...userAux,
            [e.target.name]: e.target.value
        }))
    }

    async function handleEditUser(e){
        e.preventDefault();

        try {
            let requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userAux)
            }

            const response = await fetch(`http://localhost:3001/user/${id}`, requestOptions);

            const data =  await response.json();

            window.localStorage.setItem("AUTH_TKN", data.token);

            setUserInfo(jwt_decode(data.token));

        } catch (err) {
            console.log(err);
        }

    }

    function logout() {
        setUserInfo({});
        window.localStorage.removeItem("AUTH_TKN");
    }

    return (
        <>
            <div className="col-lg-3 col-md-4 col-sm-5 p-4 text-dark bg-white shadow-sm"
                style={{ height: "160vh", overflowY: "scroll" }}>
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                        {/* <button classame="btn btn-outline-white"> */}
                            <img src={userInfo.avatar} className="rounded-circle shadow-4 cursor-pointer" style={{ width: "60px" }}
                                alt="avatar" data-bs-toggle="modal" data-bs-target="#staticBackdrop" />
                        {/* </button> */}
                        <h5 className=" ps-2 m-0 fw-bold">Hola, {userInfo.name}</h5>
                    </div>
                    <button type="button" className="btn btn-outline-white"
                        data-bs-toggle="modal" data-bs-target="#modalCloseSession" title="Cerrar Sesión">
                        <h2><i className="bi bi-clipboard-x"></i></h2>
                    </button>
                </div>
                <hr />
                <div style={{ height: "50vh", overflowY: "scroll" }}>
                    <h6 className="text-start m-1 mb-2">Notificaciones</h6>
                    <ListCardsSidebar list={userInfo.notifications} cardType="notification" />
                </div>
                <hr />
                <div>
                    <h6 className="text-start m-1 pt-3"> Últimos Documentos Asignados</h6>
                    <ListCardsSidebar list={lista.slice(0,4)} cardType="document" />
                </div>
                <hr />
                <div >
                    <h6 className="text-start m-1">Lista de Usuarios</h6>
                    <ListCardsSidebar list={usersList} cardType="user" />
                </div>
            </div>

            {/* Modal Perfil del Usuario */}

            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static"
                data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">Mi Perfil, {userInfo.name}</h5>
                            <button type="button" className="btn-close"
                                data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row justify-content-center pt-4 pb-3">
                                <div className="col-3">
                                <img src={userInfo.avatar} className="rounded-circle shadow-4" 
                                    style={{ width: "150px" }} alt="avatar"/>
                                </div>
                                <div className="col-7">
                                    <form onSubmit={handleEditUser}>
                                        <div className="mb-3">
                                            <label htmlFor="inputName" className="form-label">Nombre </label>
                                            <input
                                                type="text"
                                                id="inputName"
                                                className="form-control"
                                                value={userAux.name}
                                                onChange={handleInput}
                                                name="name" />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="inputEmail1" className="form-label">Email </label>
                                            <input
                                                type="email"
                                                id="inputEmail1"
                                                className="form-control"
                                                value={userAux.email}
                                                onChange={handleInput}
                                                name="email" />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="inputPassword" className="form-label">Contraseña</label>
                                            <input
                                                type="password"
                                                id="inputPassword"
                                                className="form-control"
                                                placeholder="********"
                                                onChange={handleInput}
                                                name="password" />
                                        </div>
                                        <button type="submit" className="btn btn-primary text-white" data-bs-dismiss="modal" >Guardar Cambios</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary text-white"
                                data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Cerrar Sesión */}

            <div className="modal fade" id="modalCloseSession" data-bs-backdrop="static"
                data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">Cerrar sesión de {userInfo.name}</h5>
                            <button type="button" className="btn-close"
                                data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            ¿Seguro que quieres cerrar sesión?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary text-white"
                                data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-danger"
                                data-bs-dismiss="modal" onClick={logout}>Cerrar Sesión</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}