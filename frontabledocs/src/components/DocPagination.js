export default function DocPagination({page, setPage, maxPage}) {

    return (
        <nav aria-label="Page navigation example">
            <ul className="pagination">
                <li className="page-item"><a className="page-link" onClick={() => page>1 ? setPage(page - 1) : setPage(1)}>Previous</a></li>
                <li className="page-item"><a className="page-link" onClick={() => setPage(1)}>1</a></li>
                <li className="page-item"><a className="page-link" onClick={() => setPage(2)}>2</a></li>
                <li className="page-item"><a className="page-link" onClick={() => setPage(3)}>3</a></li>
                <li className="page-item"><a className="page-link" onClick={() => setPage(page + 1)}>Next</a></li>
            </ul>
        </nav>
    )
}