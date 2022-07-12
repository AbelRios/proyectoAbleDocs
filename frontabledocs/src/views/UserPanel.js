import { useState, useEffect } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { useUsersListContext } from "../contexts/UsersContext";
import ListCards from "../components/ListCards";
import DocPagination from "../components/DocPagination";
import SideBarUserPage from "../components/SideBarUserPage";

export default function UserPanel() {

    const { userInfo } = useAuthContext();
    const { usersList } = useUsersListContext();

    const [docsList, setDocsList] = useState([]); // TODOS los DOCS
    const [listFiltered, setListFiltered] = useState([]) // array con los docs filtrados 
    const [docPage, setDocPage] = useState([]); // array con los 3 docs de la pagina

    const [docFilter, setDocFilter] = useState(0); // estado de filtro, 0 para todos los docs
    const [templateList, setTemplateList] = useState([]);
    const [page, setPage] = useState(1);
    const [docSearch, setDocSearch] = useState("");

    function handleSearch(e){
        setDocSearch(e.target.value)
    }

    function searchDoc(e){
        e.preventDefault();
        if(docSearch===""){
            setListFiltered(docsList)
        } else {
            setListFiltered(docsList.filter((item)=> item.title.toLowerCase().includes(docSearch.toLowerCase())))
            setPage(1);
        }
    }

    // Fetch de TODOS los documentos del usuario
    useEffect(function () {
        async function fetchDocs() {
            const response = await fetch(`http://localhost:3001/listdocumentsuser/${userInfo.id}`);
            if (response.status === 200) {
                const json = await response.json();
                setDocsList(json);
            }
        }
        fetchDocs();

    }, [userInfo])

    // Fetch de las plantillas
    useEffect(function () {
        async function fetchTemplates() {
            const response = await fetch(`http://localhost:3001/listalltemplates`)
            if (response.status === 200) {
                const json = await response.json();
                setTemplateList(json);
            }
        }
        fetchTemplates();
    }, []);

    // Modificación del array filtrado
    useEffect(function () {
        if (docFilter === 0) {
            setListFiltered(docsList.reverse());
        } else {
            setListFiltered(docsList.reverse().filter(item => item.state === docFilter))
        } setPage(1);
    }, [docFilter, docsList]);

    // Paginación
    useEffect(function () {
        setDocPage(listFiltered.slice(page * 6 - 6, page * 6));
    }, [listFiltered, page]);

    let maxPage = Math.trunc(listFiltered.length / 6 + ((listFiltered.length % 6 === 0) ? 0 : 1));
    


    return (
        <div className="container-fluid">

            <div className="row ps-4" style={{ height: "100vh" }}>
                <div className="col-lg-9 col-md-8 col-sm-7 ps-5 pe-5 mt-4 pb-4">
                    <nav className="navbar p-0">
                        <div className="container-fluid p-0 mb-5">
                        <h2 className="text-start"><i className="bi bi-clipboard"></i><b> Able</b>Docs</h2>
                            <form className="d-flex" 
                                role="search"
                                onSubmit={searchDoc}>
                                <input className="form-control rounded-pill shadow-sm px-3 " 
                                    type="search"
                                    placeholder="Buscar Documento"
                                    value={docSearch} 
                                    onChange={handleSearch}
                                    aria-label="Search" />
                                <button className="btn btn-outline-light text-dark shadow-sm rounded-pill ms-2" type="submit">
                                    <i className="bi bi-search"></i>
                                </button>
                            </form>
                        </div>
                    </nav>
                    <div className="row mb-4">
                        <ListCards list={docPage} cardType="doc" setDocFilter={setDocFilter} />
                        <DocPagination page={page} setPage={setPage} maxPage={maxPage} />
                    </div>
                    <div className="row">
                        <ListCards list={templateList} cardType="template" />
                    </div>
                </div>
                <SideBarUserPage userInfo={userInfo} docPage={docPage} usersList={usersList} lista={docsList} />
            </div>
        </div>
    )
}