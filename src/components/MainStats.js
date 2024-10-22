import {Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton} from "@mui/material";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import React, {useEffect, useState} from "react";
import Slide from "@mui/material/Slide";
import AddWorkoutSessionDialog from "./workout/AddWorkoutSessionDialog";
import CustomCard from "./display/CustomCard";
import GeneralStatsCard from "./workout/GeneralStatsCard";
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import {getTopCategoriesForUser} from "../service/workoutService";
import PopularExerciseChart from "./workout/PopularExerciseChart";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const MainStats = () => {
    const [refresh, setRefresh] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const handleDialogClose = (event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return;
        }
        setOpenDialog(false);
    }


    const handleAddWorkoutButton = () => {
        setOpenDialog(true);
    }

    const handleWorkoutAdded = () => {
        setRefresh(!refresh);
    }




    return (
        <Box sx={{
            position: 'relative',
            backgroundColor: '#2C2C2C',
            borderRadius: '8px',
            maxWidth: {xs: '95%', lg: '80%'},
            padding: '20px',
            margin: '0 auto',
            color: 'white',
            minWidth: {xs: '80%', lg: '55%'},
        }}
        >
            <Button sx={{
                position:'absolute',
                top: 10,
                right: 10
            }} onClick={handleAddWorkoutButton}>Dodaj trening</Button>
            <AddWorkoutSessionDialog open={openDialog} onClose={handleDialogClose} Transition={Transition} onWorkoutAdded={handleWorkoutAdded}/>
            <GeneralStatsCard refresh={refresh}/>
            <PopularExerciseChart refresh={refresh}/>
        </Box>
    );
};

export default MainStats;