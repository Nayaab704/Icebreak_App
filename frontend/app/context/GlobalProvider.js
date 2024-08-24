import { createContext, useContext, useEffect, useState } from "react";
import { getToken } from "../../lib/authTools";
import { tokenLogin } from "../../api/authApi";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext)

const GlobalProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                setIsLoading(true)
                const token = await getToken()
                if(token) {
                    const res = await tokenLogin(token)
                    setIsLoggedIn(true)
                    setUser(res.id)
                }
            } catch (error) {
                console.log("Token validation failed", error)
                setUser(null)
            }finally {
                setIsLoading(false)
            }
        }

        getCurrentUser()
    }, [])

    return(
        <GlobalContext.Provider
            value={{
                isLoggedIn,
                setIsLoggedIn,
                user,
                setUser,
                isLoading
            }}
        >
            {children}
        </GlobalContext.Provider>
    )

}

export default GlobalProvider