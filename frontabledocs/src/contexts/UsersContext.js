import { useContext, createContext, useState, useMemo, useEffect } from "react";
import { useAuthContext } from "./AuthContext";

const UsersListContext = createContext({

    usersList: [],
    setUsersList: () => {}

});

export default function UsersListContextProvider({ children }){

    const {userInfo} = useAuthContext();

    const [usersList, setUsersList] = useState([]);

    useEffect(function () {
        async function fetchUsers() {
            const response = await fetch(`http://localhost:3001/userslist`);
            if (response.status === 200) {
                const json = await response.json();
                setUsersList(json);
            }
        }
        fetchUsers();
    }, [userInfo]);

    const value = useMemo(
        () => ({
            usersList,
            setUsersList
        }), 
        [usersList, setUsersList]
    );

    return <UsersListContext.Provider value={value}> {children} </UsersListContext.Provider>

}

export function useUsersListContext(){
    return useContext(UsersListContext);
}