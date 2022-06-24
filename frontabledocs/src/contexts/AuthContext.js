import { useContext, createContext, useState, useMemo } from "react";
import jwt_decode from "jwt-decode";

const AuthContext = createContext({

    userInfo: {},
    setUserInfo: () => {}

});

export default function AuthContextProvider({ children }){

    let token = window.localStorage.getItem("MY_AUTH_APP");

    const [userInfo, setUserInfo] = useState( token ? jwt_decode(token) : null);

    const value = useMemo(
        () => ({
            userInfo,
            setUserInfo
        }), 
        [userInfo, setUserInfo]
    );

    return <AuthContext.Provider value={value}> {children} </AuthContext.Provider>

}

export function useAuthContext(){
    return useContext(AuthContext);
}