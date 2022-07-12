import { useUsersListContext } from "../contexts/UsersContext"
import { Link } from "react-router-dom";
import { EDITOR } from "../config/routes/paths";

export default function CardDocument({ document }) {

    const { usersList } = useUsersListContext();

    function tag(state) {
        if (state === 1) {
            return (<span className="badge rounded-pill bg-info text-dark">En Proceso</span>)
        } else if (state === 2) {
            return (<span className="badge rounded-pill bg-warning text-dark">En Revisión</span>)
        } else {
            return (<span className="badge rounded-pill bg-success text-dark">Aprobado</span>)
        }
    }


    return (
        <div className="col mb-4">
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="clearfix">
                        <div className="float-md-end">{tag(document.state)}</div>
                    </div>
                    <h5 className="fw-bold">{document.title}</h5>
                    <div className="text-start">{document.type}</div>
                    <div className="text-start text-light">{document.lastUpdated}</div>
                </div>
                <div className="card-footer">
                    <div className="row">
                        <div className="col-6">{
                            usersList.map((user, index) => {
                                if (document.users.includes(user._id)) {
                                    return (
                                        <img src={user.avatar} key={index}
                                            className="rounded-circle shadow-4 border border-white border-3 "
                                            style={{ width: "40px" }} alt="avatar" title={user.name} />
                                    )
                                }
                            })
                        }
                        </div>
                        <div className="col-6">
                            <Link to={EDITOR.replace(":type", "doc").replace(":id", document._id)}>
                                <button className="btn float-end btn-outline-light text-dark 
                                shadow-sm rounded-pill">Editar</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}