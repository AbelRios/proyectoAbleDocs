export default function DocPagination({page, setPage, maxPage}) {

    return (
        <nav aria-label="Documents navigation">
            <ul className="pagination">
                <li className="page-item"><button className="page-link rounded-pill shadow-sm" onClick={() => page > 1 ? setPage(page - 1) : setPage(1)}>Anterior</button></li>
                <li className="page-item px-2">...</li>
                <li className=" page-item"><button className="text-dark btn btn-outlined rounded-pill px-2 " onClick={() => setPage(page)}>{page}</button></li>
                <li className="px-2">...</li>
                <li className="page-item"><button className="page-link rounded-pill shadow-sm" onClick={() => page < maxPage ? setPage(page + 1) : setPage(page)}>Siguiente</button></li>
                <li className=" page-item"><button className="page-link rounded-pill px-2 shadow-sm ms-2 px-3" onClick={() => setPage(maxPage)}>Última página</button></li>

            </ul>
        </nav>
    )
}