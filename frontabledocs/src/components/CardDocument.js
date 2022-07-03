
export default function CardDocument({document}) {

    //document de testeo, habría que pasarle el document por props al componente
    //además, enlazar el botón de "editar" al navigate, que nos lleve al editor llamando a este documento (id)

    // const document = {
    //     _id: "0001",
    //     type: "Contrato de Arrendamiento",
    //     title: "Contrato de Ejemplo",
    //     users: [
    //         "62a8a384b4bc932fe7640068",
    //         "62a9e5af4d16506c55eeafbe",
    //     ],
    //     state: "En proceso",
    //     lastUpdated: "10/06/2022",
    // }

    async function getUser(id){
        const response = await fetch(`http://localhost:3001/user/${id}`);
        if(response.status===200){
            const json = await response.json();
            return(json);
        }
    }

    function tag(state){
        if(state===1){
            return (<span className="badge rounded-pill bg-info text-dark">En Proceso</span>)
        }else if(state===2){
            return(<span className="badge rounded-pill bg-secondary text-dark">En Revisión</span>)
        }else{
            return(<span className="badge rounded-pill bg-success text-dark">Aprobado</span>)
        }
    }

    function avatars(users){
        users.forEach(element => {
            let aux =  getUser(element);
            console.log(aux);
            return(
                <img src={aux.avatar} class="rounded-circle shadow-4" style={{width: "25px" }} alt="Avatar" />
            )
        });
    }

    return (
        <div className="col mb-5">
            <div className="card shadow-sm rounded" style={{ width: '22rem' }}>
                <h5 className="card-header fw-bold">{document.title}</h5>
                <div className="card-body pt-0">
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">{document.template.title}</li>
                        <li className="list-group-item">Estado: {tag(document.state)}</li>
                        <li className="list-group-item text-light">Última edición: {document.lastUpdated}</li>
                        <li className="list-group-item">{avatars(document.users)}</li>
                        <div className="container mt-3">
                            <button className="btn btn-outline-primary rounded-pill">Editar</button>
                        </div>
                    </ul>
                </div>
            </div>
        </div>
    )
}