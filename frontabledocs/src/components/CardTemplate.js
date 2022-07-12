import { EDITOR } from "../config/routes/paths"
import { Link } from "react-router-dom";

export default function CardTemplate({ template }) {

    return (
        <div className="col mb-5">
            <div className="card shadow-sm rounded" >
                <h5 className="card-header fw-bold">{template.type}</h5>
                <div className="card-body">
                    <div className="text-start mb-3">{template.description}</div>
                    <div className="text-start">
                        <Link to={EDITOR.replace(":type", "newdoc").replace(":id", template._id)}>
                            <button className="btn btn-outline-light text-black shadow-sm 
                                rounded-pill">Crear Documento</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}