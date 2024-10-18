import {Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton} from "@mui/material";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import React, {useState} from "react";
import Slide from "@mui/material/Slide";
import AddWorkoutSessionDialog from "./workout/AddWorkoutSessionDialog";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const MainStats = () => {

    const [openDialog, setOpenDialog] = useState(false);

    const handleDialogClose = () => {
        setOpenDialog(false);
    }


    const handleAddWorkoutButton = () => {
        setOpenDialog(true);
    }


    return (
        <Box sx={{
            backgroundColor: '#2c2c2c',
            position: 'relative',

        }}>
            <Button onClick={handleAddWorkoutButton}>Dodaj trening</Button>

            <AddWorkoutSessionDialog open={openDialog} onClose={handleDialogClose} Transition={Transition}/>
        </Box>
    );
};

export default MainStats;