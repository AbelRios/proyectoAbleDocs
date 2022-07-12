export default function CardDocSidebar({item}) {

    return (
        <div className="card border-white text-start" >
            <div className="card-body p-2">
                <div className="row">
                    <div className="col-2">
                        <h3 className={
                            (item.state === 1) ? "text-info" : 
                            (item.state === 2) ? "text-warning" :
                            (item.state === 3) ? "text-success" : ""}><i className="bi bi-clipboard-check-fill"></i></h3>
                    </div>
                    <div className="col-10">
                        <p className="fs-6 fw-bold card-title">{item.title}</p>
                        <p className="fs-6 card-subtitle mb-2 text-muted align-content-start">
                            {(item.state === 1) ? "En Proceso" : 
                            (item.state === 2) ? "En Revisión" :
                            (item.state === 3) ? "Aprobado" : ""}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}