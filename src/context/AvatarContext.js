import {createContext, useCallback, useEffect, useState} from "react";
import {getUserAvatar} from "../service/userService";

export const AvatarContext = createContext();

export const AvatarProvider = ({children}) => {
    const [avatar, setAvatar] = useState(null);

    const fetchAvatar = useCallback(async () => {
        const data = await getUserAvatar();
        setAvatar(data);
    }, []);

    useEffect(() => {
        fetchAvatar();
    }, [fetchAvatar]);

    return (
        <AvatarContext.Provider value={{avatar, refreshAvatar: fetchAvatar}}>
            {children}
        </AvatarContext.Provider>
    )
}