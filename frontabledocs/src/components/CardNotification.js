import { useAuthContext } from "../contexts/AuthContext"
import { useLocation, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";


export default function CardNotification({item}) {

    const location = useLocation();
    const navigate = useNavigate();

    const {userInfo, setUserInfo } = useAuthContext();

    let userAux = userInfo;

    async function deleteNotification(idnotification){
        console.log(userAux.notifications);
        userAux.notifications = userAux.notifications.filter((notification) => notification.id !== idnotification)
        console.log(userAux.notifications);

        const {id, exp, iat, ...rest } = userAux;
        
        try {
            let requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rest)
            }

            const response = await fetch(`http://localhost:3001/user/${id}`, requestOptions);

            const data =  await response.json();

            window.localStorage.setItem("AUTH_TKN", data.token);

            setUserInfo(jwt_decode(data.token));

            navigate(0);

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="card border-white text-start shadow-sm mb-2" >
            <div className="card-body p-3">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-9">
                            <p className="card-subtitle fs-6 mb-2 text-start text-warning">{item.date}</p>
                            <p className="card-title fw-bold fs-6">{item.from}</p>
                            <p className="card-text fs-6">{item.message}</p>
                        </div>
                        <div className="col-sm-3">
                            
                            <button className="btn btn-sm rounded btn-outline-success" onClick={() => deleteNotification(item.id)}>
                                <h3><i className="bi bi-clipboard-check text-center"></i></h3>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}