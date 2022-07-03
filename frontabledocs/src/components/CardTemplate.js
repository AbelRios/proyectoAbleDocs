export default function CardTemplate({template}){


    return(
        <div className="col mb-5">
            <div className="card shadow-sm rounded" style={{ width: '22rem' }}>
                <h5 className="card-header fw-bold">{template.title}</h5>
                <div className="card-body pt-0">
                    <ul className="list-group list-group-flush">
                        <div className="container mt-3">
                            <button className="btn btn-outline-primary rounded-pill">Crear Documento</button>
                        </div>
                    </ul>
                </div>
            </div>
        </div>
    )
}