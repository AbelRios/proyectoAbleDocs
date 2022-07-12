import CardDocument from "./CardDocument";
import CardTemplate from "./CardTemplate";
import DropdownFilterDocs from "./DropdownFilterDocs";

export default function ListCards({ list, cardType, users, setDocFilter }) {


    return (
        <div className="container" style={{heigh: "200px"}}>
            <div className="row align-items-start mb-3">
                <div className="col-lg-8">
                    {(cardType === "doc") ? <h2>Últimos Documentos</h2> : <h2>Plantillas</h2>}
                </div>
                {(cardType === "doc") ? <DropdownFilterDocs cardType={cardType} setDocFilter={setDocFilter} /> : ""}
            </div>
            <div className="row row-cols-sm-1 row-cols-md-2 row-cols-lg-3">
                {
                    list.map((item, index) => {
                        return (
                            <div key={index}>
                                {(cardType === "doc") ? <CardDocument document={item} users={users} /> : <CardTemplate template={item} />}
                            </div>
                        )
                    }
                    )
                }
            </div>
        </div>
    )
}