import CardDocSidebar from "./CardDocSidebar";
import CardNotification from "./CardNotification";
import CardUserSidebar from "./CardUserSidebar";

const cardsSide = {
    notification: CardNotification,
    document: CardDocSidebar,
    user: CardUserSidebar
}

export default function ListCardsSidebar({ list, cardType }) {

    const Component = cardsSide[cardType];

    return (
        <div >
            {
                list?.map((i, index) => {
                    return (
                        <div key={index} >
                            <Component item={i} list={list} index={index} />
                        </div>)
                })
            }
        </div>

    )
}