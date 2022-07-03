import CardDocument from "./CardDocument";
import CardTemplate from "./CardTemplate";

export default function ListCards({list, cardType}){


    return(
        <div className="container">
            <div className="row align-items-start">
                <div className="col">
                    {(cardType==="doc")? <h2>Últimos Documentos</h2> : <h2>Plantillas</h2>}
                </div>
                <div className="col-5"></div>
                <div className="col">
                    {(cardType==="doc")? "Filtro" : "" }
                </div>
            </div>
            <div className="row row-cols-2 row-cols-md-3">
                {
                    list.map((item, index) => {
                        return (
                            <div key={index}>
                                {(cardType==="doc")? <CardDocument document={item} /> : <CardTemplate template={item} /> }
                            </div>
                        )
                    }
                    )
                }
            </div>
        </div>
    )
}