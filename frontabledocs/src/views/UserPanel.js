import { useState, useEffect } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import ListCards from "../components/ListCards";
import DocPagination from "../components/DocPagination";

export default function UserPanel() {

    const {userInfo} = useAuthContext();

    const [docsList, setDocsList] = useState([]);
    const [templateList, setTemplateList] = useState([]);
    const [docPage, setDocPage] = useState([]) ;
    const [page, setPage] = useState(1);

    useEffect (function(){

        async function fetchDocs(){

            const response = await fetch (`http://localhost:3001/listdocumentsuser/${userInfo.id}`);
            if(response.status===200){
                const json = await response.json();
                setDocsList(json);
            }
        }
        fetchDocs();

    },[userInfo])

    useEffect(function(){

        async function fetchTemplates(){

            const response = await fetch(`http://localhost:3001/listalltemplates`)
            if(response.status===200){
                const json = await response.json();
                setTemplateList(json);
            }
        }
        fetchTemplates();
    },[])

    useEffect(function(){
        setDocPage(docsList.slice(page*3-3,page*3));
    },[docsList,page]);

    let maxPage = docsList/3 + (docsList%3===0) ? 0 : 1;



    return (
        <div className="container">
            <h1 className="pt-5 pb-5"> User Panel </h1>
            <div className="row justify-content-center">
               <ListCards list={docPage} cardType="doc"/>
               <DocPagination page={page} setPage={setPage} maxPage={maxPage}/>
               <ListCards list={templateList} cardType="template"/>
            </div>
        </div>
    )
}