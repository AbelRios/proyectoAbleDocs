import { useAuthContext } from "../contexts/AuthContext";
import { useUsersListContext } from "../contexts/UsersContext";
import { ADMIN } from '../const/roles';

export default function CardUserSidebar({ item, index }) {

    const { setUsersList } = useUsersListContext();

    const deleteModalClass = `deleteUserModal${index}`;
    const buttonDeleteModalClass = `#deleteUserModal${index}`;
    const editModalClass = `editUserModal${index}`;
    const buttonEditModalClass = `#editUserModal${index}`;

    async function fetchUsers() {
        const response = await fetch(`http://localhost:3001/userslist`);
        if (response.status === 200) {
            const json = await response.json();
            setUsersList(json);
        }
    }

    async function handleDelete(id) {
        let requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        }
        await fetch(`http://localhost:3001/deleteuser`, requestOptions);

        fetchUsers();
    }

    async function handleAdmin(id) {
        let requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        }
        await fetch(`http://localhost:3001/useradmin/${id}`, requestOptions);

        fetchUsers();
    }

    const { userInfo } = useAuthContext();

    return (
        <>
            <div className="card border-white shadow-sm mb-2 text-start" >
                <div className="card-body p-2">
                    <div className="row align-items-center">
                        <div className="col-3">
                            <button className="btn btn-outline-white p-1">
                                <img src={item.avatar}
                                    className="rounded-circle shadow-4" style={{ width: "40px" }} alt="avatar"
                                    data-bs-toggle="modal" data-bs-target={buttonEditModalClass} />
                            </button>
                        </div>
                        <div className="col-5">
                            <p className="fs-6 fw-bold card-title">{item.name}</p>
                            <p className="fs-6 card-subtitle  text-muted align-content-start">
                                {(item.roles.includes(Number(ADMIN))) ? "Admin" : "Usuario"}
                            </p>
                        </div>
                        {(userInfo.roles.includes(Number(ADMIN))) ?
                            <div className="col-4">
                                <div className="row ">
                                    <div className="col text-center p-0">
                                        <button type="button" className="btn btn-sm btn-info"
                                            data-bs-toggle="modal" data-bs-target={buttonEditModalClass}>
                                            <i className="bi bi-pencil-fill"></i>
                                        </button>
                                    </div>
                                    <div className="col p-0">
                                        <button type="button" className="btn btn-sm btn-danger"
                                            data-bs-toggle="modal" data-bs-target={buttonDeleteModalClass}>
                                            <i className="bi bi-trash3"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            : ""}
                    </div>
                </div>
            </div>

            {/* Modal Borrar Usuario */}

            <div className="modal fade" id={deleteModalClass} data-bs-backdrop="static" data-bs-keyboard="false"
                tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">Eliminar Usuario</h5>
                            <button type="button" className="btn-close"
                                data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Estás a punto de eliminar el usuario {item.name}, ¿Seguro que quieres continuar?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary text-white"
                                data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-danger"
                                onClick={() => handleDelete(item._id)}
                                data-bs-dismiss="modal">Eliminar Usuario</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Editar Usuario SideBar */}

            <div className="modal fade" id={editModalClass} data-bs-backdrop="static" data-bs-keyboard="false"
                tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">Perfil de Usuario</h5>
                            <button type="button" className="btn-close"
                                data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body p-4">
                            <div className="row m-2">
                                <div className="col-4 justify-content-center">
                                    <img src={item.avatar} className="rounded-circle mb-4" style={{ width: "100px" }}
                                        alt="avatar" />
                                </div>
                                <div className="col-8">
                                    <p className="fs-6">Nombre: {item.name}</p>
                                    <p className="fs-6">Email: {item.email}</p>
                                    <p className="fs-6">Rol: {(item.roles.includes(Number(ADMIN))) ? "Admin" : "Usuario"}</p>
                                    <p className="fs-6 fw-bold mt-4">¿Desea nombrar al usuario {item.name} como Administrador?</p>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary text-white"
                                data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-primary"
                                onClick={() => handleAdmin(item._id)}
                                data-bs-dismiss="modal">Nombrar Administrador</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}