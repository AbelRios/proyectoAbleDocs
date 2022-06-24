import { useState } from "react";
import jwt_decode from "jwt-decode";

export default function CheckToken() {

    const[data, setData] = useState("");

    function handleInput(e){
        setData(e.target.value);
    }

    function handleSubmit(e){
        e.preventDefault();
        console.log(jwt_decode(data));
    }

    return (
        <main className="App">
            <>
                <form onSubmit={handleSubmit}>
                <label for="controlToken">Token</label>
                <input
                        type="text"
                        className="form-control"
                        name="controlToken"
                        onChange={handleInput}
                        placeholder="token" />
                </form>
                <button type="submit" className="btn btn-primary">Submit</button>

            </>
        </main>
    )
}