import {createContext, useCallback, useEffect, useState} from "react";
import {getUserAvatar} from "../service/userService";
import {useAuth} from "./AuthContext";

export const AvatarContext = createContext();

export const AvatarProvider = ({children}) => {
    const [avatar, setAvatar] = useState(null);
    const {isAuthenticated} = useAuth();

    const fetchAvatar = useCallback(async () => {
        if (isAuthenticated) {
            const data = await getUserAvatar();
            setAvatar(data);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchAvatar();
    }, [fetchAvatar]);


    const updateAvatar = (newAvatar) => {
        setAvatar(newAvatar);
    };

    return (
        <AvatarContext.Provider value={{avatar, refreshAvatar: fetchAvatar, updateAvatar}}>
            {children}
        </AvatarContext.Provider>
    )
}