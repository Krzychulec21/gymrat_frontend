import ProfileInfo from "../components/ProfileInfo";
import {Box, CircularProgress} from "@mui/material";
import {useEffect, useState} from "react";
import {getUser, getUserAvatar, getUserPersonalInfo} from "../service/userService";



const ProfilePage = () => {
    const [avatar, setAvatar] = useState(null);
    const [user, setUser] = useState(null);
    const [personalInfo, setPersonalInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [avatarUrl, userData, personalInfoData] = await Promise.all([
                    getUserAvatar(),
                    getUser(),
                    getUserPersonalInfo(),
                ]);
                setAvatar(avatarUrl);
                setUser(userData);
                setPersonalInfo(personalInfoData);
            } catch (error) {
                console.error("Failed to load data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading || !user || !personalInfo) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }
    return (
        <Box sx={{ display: 'flex' }}>
            <ProfileInfo user={user} personalInfo={personalInfo} avatar={avatar} />
        </Box>
    );
};

export default ProfilePage;