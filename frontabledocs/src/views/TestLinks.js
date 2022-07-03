import { Link } from "react-router-dom"
import { REGISTER, LOGIN, UNAUTHORIZED, EDITOR, ADMIN_PANEL, USER_PANEL, LOGOUT, PROFILE } from '../config/routes/paths';


export default function TestLinks() {
    return (
        <section>
            <h1>Links</h1>
            <br />
            <h2>Public</h2>
            <p><Link to={LOGIN}>Login</Link></p>
            <p><Link to={REGISTER}>Register</Link></p>
            <p><Link to={UNAUTHORIZED}></Link></p>

            <br />
            <h2>Private</h2>
            <p><Link to={USER_PANEL}>User Page</Link></p>
            <p><Link to={ADMIN_PANEL}>Admin Page</Link></p>
            <p><Link to={PROFILE}>Profile</Link></p>
            <p><Link to={EDITOR}>Editor Page</Link></p>
            <p><Link to={LOGOUT}> Log Out</Link></p>

        </section>
    )
}