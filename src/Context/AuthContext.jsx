import { createContext,useState } from "react";

export const AuthContext=createContext()

export function AuthContextProvider({children}){
const [userToken, setUserToken] = useState(() => localStorage.getItem('token') || null);

    return <AuthContext.Provider value={{ userToken, setUserToken }}>
        {children}
    </AuthContext.Provider>
}