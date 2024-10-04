import ProfileInfo from "../components/ProfileInfo";
import {Box} from "@mui/material";

const ProfilePage = () => {
   const user = {
       email:"kowalski.pl", firstName: "Jan", lastName:"Kowalski"
   }
    return (
        <Box sx={{display:'flex', justifyContent:"center"}}>
            <ProfileInfo user={user}/>
        </Box>
    );
};

export default ProfilePage;