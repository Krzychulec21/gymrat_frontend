import ProfileInfo from "../components/ProfileInfo";
import {Box, CircularProgress} from "@mui/material";
import {useCallback, useContext, useEffect, useState} from "react";
import {getUser, getUserPersonalInfo} from "../service/userService";
import {AvatarContext} from "../context/AvatarContext";


const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [personalInfo, setPersonalInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const {avatar, refreshAvatar} = useContext(AvatarContext);

    const fetchData = useCallback(async () => {
        try {
            const [userData, personalInfoData] = await Promise.all([
                getUser(),
                getUserPersonalInfo(),
            ]);
            setUser(userData);
            setPersonalInfo(personalInfoData);
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDataUpdate = useCallback(() => {
        fetchData();
    }, [fetchData]);

    if (loading || !user || !personalInfo) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                <CircularProgress/>
            </Box>
        );
    }
    return (
        <Box sx={{display: 'flex'}}>
            <ProfileInfo user={user} personalInfo={personalInfo} avatar={avatar} onDataUpdate={handleDataUpdate}/>
        </Box>
    );
};

export default ProfilePage;