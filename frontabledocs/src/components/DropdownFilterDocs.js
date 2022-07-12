export default function DropdownFilterDocs({cardType, setDocFilter}) {
    
    return (
        <div className="col-lg-4">
                <div className="dropdown float-end">
                    <button className="btn btn-outline-primary dropdown-toggle mb-2" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                        Filtrar Documentos
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li><button className="dropdown-item" onClick={() => { setDocFilter(0) }}>Todos</button></li>
                        <li><button className="dropdown-item" onClick={() => { setDocFilter(1) }}>En Proceso</button></li>
                        <li><button className="dropdown-item" onClick={() => { setDocFilter(2) }}>En Revisión</button></li>
                        <li><button className="dropdown-item" onClick={() => { setDocFilter(3) }}>Aprobados</button></li>
                    </ul>
                </div>
        </div>
    )
}
