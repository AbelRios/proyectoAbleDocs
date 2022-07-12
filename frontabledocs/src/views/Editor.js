import { useNavigate, useParams } from "react-router-dom";
import { USER_PANEL } from "../config/routes/paths";
import { useUsersListContext } from "../contexts/UsersContext";
import { useAuthContext } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import { ADMIN } from "../const/roles";
import CardUsersEditor from "../components/CardUsersEditor.js"
import PreviewCompraVentaInmueble from "../components/PreviewCompraVentaInmueble";

export default function Editor() {

    const navigate = useNavigate();

    const { userInfo } = useAuthContext();
    const { usersList } = useUsersListContext();

    const params = useParams(); // type: doc/newdoc, id: id de la plantilla o del doc
    const { type, id } = params;
    const esNuevo = (type === "newdoc"); // vamos a usar para saber si es un nuevo documento (true) o no (false)

    const [documento, setDocumento] = useState({});  //donde metemos el documento desde la API
    const [valoresAux, setValoresAux] = useState([]);    // objeto valores auxiliar (para el form)
    const [labels, setLabels] = useState([]);    //array de [clave, valor] de los labels
    const [valores, setValores] = useState([]);      //array de [clave, valor] de los valores


    useEffect(function () {
        async function fetchDoc() {
            const response = await fetch(`http://localhost:3001/document/${id}`)
            if (response.status === 200) {
                const json = await response.json();
                setDocumento(json);
                setValoresAux(json.valores);
                setLabels(Object.entries(json.labels));
                setValores(Object.entries(json.valores));
            }
        }

        async function fetchTemplate() {
            const response = await fetch(`http://localhost:3001/template/${id}`)
            if (response.status === 200) {
                const json = await response.json();
                setDocumento(json);
                setValoresAux(json.valores);
                setLabels(Object.entries(json.labels));
                setValores(Object.entries(json.valores));
            }
        }

        if (esNuevo) {
            fetchTemplate();
            documento.state = 1;
            documento.title = "Nuevo Documento";
        } else {
            fetchDoc();
        }
    }, [])


    // Inicializamos el objeto documento
    if (esNuevo) {
        if (!userInfo.roles.includes(Number(ADMIN))) {
            documento.users = [userInfo.id];
            documento.firma1="";
        }
    }

    documento.valores = valoresAux;

    function tag(state) {
        if (state === 1) {
            return (<h5 className="mb-3"><span className="badge rounded-pill bg-info text-dark">En Proceso</span></h5>)
        } else if (state === 2) {
            return (<h5 className="mb-3"><span className="badge rounded-pill bg-warning text-dark">En Revisión</span></h5>)
        } else {
            return (<h5 className="mb-3"><span className="badge rounded-pill bg-success text-dark">Aprobado</span></h5>)
        }
    }

    function handleInputs(e) {
        setValoresAux((valoresAux) => ({
            ...valoresAux,
            [e.target.name]: e.target.value
        }))
    }

    function handleTitle(e) {
        setDocumento((documento) => ({
            ...documento,
            [e.target.name]: e.target.value
        }))
        console.log(documento.title)
    }

    function handleBack() {
        navigate(USER_PANEL);
    }

    function handleChanges() {
        if (esNuevo) {
            async function postDoc() {
                const { _id, ...rest } = documento;
                let requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(rest)
                }
                await fetch(`http://localhost:3001/document`, requestOptions);
            }
            postDoc();
            navigate(USER_PANEL);
        } else {
            async function putDoc() {
                const { _id, ...rest } = documento;
                let requestOptions = {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(rest)
                }
                await fetch(`http://localhost:3001/document/${_id}`, requestOptions);
            }
            putDoc();
        }
    }

    function borrarDoc() {
        async function deleteDoc() {
            const { _id, ...rest } = documento;
            let id = _id;
            let requestOptions = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            }
            await fetch(`http://localhost:3001/document`, requestOptions);
        }
        deleteDoc();
        navigate(USER_PANEL);
    }

    function revisarDoc() {
        async function revDoc() {
            let idDocument = documento._id;
            let username = userInfo.name;
            let docname = documento.title;
            let requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idDocument, username, docname })
            }
            await fetch(`http://localhost:3001/statelookover`, requestOptions);
        }
        revDoc();
        // navigate(USER_PANEL);
    }

    function aprobarDoc() {
        async function aprDoc() {
            let token = window.localStorage.getItem("AUTH_TKN");
            let idDocument = documento._id;
            let username = userInfo.name;
            let docname = documento.title;
            let requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': token },
                body: JSON.stringify({ idDocument, username, docname })
            }
            await fetch(`http://localhost:3001/stateapproved`, requestOptions);
        }
        aprDoc();
        // navigate(USER_PANEL);
    }

    return (
        <div className="container-fluid">
            <div className="row">

                {/* Sidebar Formulario */}
                <div className="col-md-3 bg-white shadow " style={{ height: "100vh", overflowY: "scroll" }}>

                    {/* Top */}
                    <div className="row align-items-center mt-4 mb-4">
                        <div className="col-2">
                            <h3 className="p-0 m-0 ps-4">
                                <button className="btn btn-outline-white fs-4 p-0 m-0">
                                    <i className="bi bi-arrow-left" onClick={handleBack}></i>
                                </button></h3>
                        </div>
                        <div className="col-10 ">
                            <h3 className="p-0 m-0 ps-3"><i className="bi bi-clipboard"></i>
                                <b> Able</b>Docs</h3>
                        </div>
                    </div>
                    <form >
                        <hr />

                        {/* Botones */}
                        <div className="row px-3 mt-4">
                            <div className="col-3">
                                <button className="btn btn-outline-success text-black rounded-pill pb-0" title="Guardar Cambios"
                                    onClick={handleChanges}><h4><i className="bi bi-clipboard-check"></i></h4></button>
                            </div>

                            <div className="col-3">
                                <button className="btn btn-outline-secondary rounded-pill text-black pb-0" title="Imprimir PDF"
                                    id="btnPrint"><h4><i className="bi bi-printer"></i></h4></button>
                            </div>

                            <div className="col-3">

                                {(documento.state === 1) ?
                                    <button className="btn btn-outline-warning rounded-pill text-black pb-0" title="Mandar a Revisar"
                                        onClick={revisarDoc}><h4><i className="bi bi-upload"></i></h4></button>
                                    : (documento.state === 2) && (userInfo.roles.includes(Number(ADMIN))) ?
                                        <button className="btn btn-outline-success rounded-pill text-black pb-0" title="Aprobar Documento"
                                            onClick={aprobarDoc}><h4><i className="bi bi-check-circle"></i></h4></button>
                                        : <button className="btn btn-outline-success rounded-pill text-black pb-0" title="Aprobar Documento"
                                            disabled><h4><i className="bi bi-check-circle"></i></h4></button>
                                }
                            </div>

                            <div className="col-3">
                                {(userInfo.roles.includes(Number(ADMIN))) ?
                                    <button type="button" className="btn btn-outline-danger rounded-pill text-black pb-0" title="Eliminar Documento"
                                        data-bs-toggle="modal" data-bs-target="#buttonDeleteDocModal"><h4><i className="bi bi-trash3"></i></h4></button>
                                    : <button className="btn btn-outline-danger rounded-pill text-black pb-0" title="Eliminar Documento"
                                        disabled><h4><i className="bi bi-trash3"></i></h4></button>
                                }
                            </div>
                        </div>
                        <hr className="mt-3" />

                        {/* Formulario */}
                        <div className="px-3 mb-3 mt-3">
                            <label htmlFor="titulo" className="form-label">Título del Documento</label>
                            <input
                                type="text"
                                id="titulo"
                                className="form-control"
                                // value={valores[index][1]}
                                placeholder={documento.title}
                                onChange={handleTitle}
                                name="title"
                            />
                        </div>
                        <div className="d-flex align-items-center justify-content-between px-3">
                            <h6>Estado del Documento:</h6>
                            {tag(documento.state)}
                        </div>
                        <div className="accordion px-3" id="accordionExample">
                            <div className="accordion-item ">
                                <h2 className="accordion-header" id="headingOne">
                                    <button className="accordion-button" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                        Datos del Contrato
                                    </button>
                                </h2>
                                <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne"
                                    data-bs-parent="#accordionExample">
                                    <div className="accordion-body">

                                        {/* Formulario */}
                                        {
                                            labels?.map((item, index) => {

                                                let idInputForm = `input${valores[index][0]}`;

                                                return (

                                                    <div className="mb-3 p-1" key={index}>
                                                        <label htmlFor={idInputForm} className="form-label">
                                                            {item[1]}</label>
                                                        <input
                                                            type="text"
                                                            id={idInputForm}
                                                            className="form-control rounded-pill"
                                                            // value={valores[index][1]}
                                                            placeholder={valores[index][1]}
                                                            onChange={handleInputs}
                                                            name={valores[index][0]} />
                                                    </div>
                                                )
                                            })


                                        }
                                        {/* <div className="mb-3 p-1">
                                            <label htmlFor="#firma1" className="form-label">
                                                {item[1]}</label>
                                            <input
                                                type="text"
                                                id="firma1"
                                                className="form-control rounded-pill"
                                                // value={valores[index][1]}
                                                placeholder={valores[index][1]}
                                                onChange={handleInputs}
                                                name={valores[index][0]} />
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div>
                        <p className="px-3 mt-4">Usuarios Asignados</p>
                        {/* Lista de Usuarios Asignados */}
                        {
                            usersList.map((item, index) => {
                                return (
                                    documento.users?.includes(item._id) ?
                                        (
                                            <div className="px-3 mt-2" key={index}>
                                                <CardUsersEditor item={item} />
                                            </div>
                                        ) : ""
                                )
                            })
                        }



                    </div>
                </div>

                {/* Previsualización del Editor */}
                <div className="col-md-9 px-5" style={{ maxHeight: "100vh", overflowY: "scroll" }}>
                    <div className=" px-4" id="dvContainer">
                        {
                            valoresAux && <PreviewCompraVentaInmueble valores={valoresAux} />
                        }

                        {/* <div dangerouslySetInnerHTML={{ __html: text.replace("{documento.lugar}",pepe) }}></div> */}
                    </div>
                </div>
            </div>

            {/* Modal Borrar Documento */}
            <div className="modal fade" id="buttonDeleteDocModal" data-bs-backdrop="static" data-bs-keyboard="false"
                tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">Eliminar Documento</h5>
                            <button type="button" className="btn-close"
                                data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Estás a punto de eliminar el documento {documento.title}, ¿Seguro que quieres continuar?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary text-white"
                                data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-danger"
                                onClick={borrarDoc}
                                data-bs-dismiss="modal">Eliminar Documento</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}