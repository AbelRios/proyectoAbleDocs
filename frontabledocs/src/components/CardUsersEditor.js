import { ADMIN } from '../const/roles';

export default function CardUsersEditor({ item }) {

    return (
        <>
            <div className="card border-white mb-2 text-start" >
                <div className="card-body p-2">
                    <div className="row align-items-center">
                        <div className="col-4 ps-4">  
                                <img src={item.avatar}
                                    className="rounded-circle shadow-4" style={{ width: "40px" }} alt="avatar"
                                    title={item.name} />
                        </div>
                        <div className="col-7">
                            <p className="fs-6 fw-bold card-title">{item.name}</p>
                            <p className="fs-6 card-subtitle  text-muted align-content-start">
                                {(item.roles.includes(Number(ADMIN))) ? "Admin" : "Usuario"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}