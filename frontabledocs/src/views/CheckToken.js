import { useState } from "react";
import jwt_decode from "jwt-decode";

export default function CheckToken() {

    const [data, setData] = useState("");

    function handleInput(e) {
        e.preventDefault();
        setData(e.target.value);
        console.log(data);
    }

    function handleSubmit(event) {
        event.preventDefault();
        console.log(jwt_decode(data));
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label for="controlToken">Token </label>
                <input
                    type="text"
                    id="controlToken"
                    className="form-control"
                    onChange={handleInput}
                    placeholder="token" />
                <button type="submit"> Submit </button>
            </form>
        </div>
    )
}