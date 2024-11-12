import {Box} from "@mui/material";
import Button from "@mui/material/Button";
import React, {useState} from "react";
import Slide from "@mui/material/Slide";
import WorkoutSessionDialog from "./workout/WorkoutSessionDialog";
import GeneralStatsCard from "./workout/GeneralStatsCard";
import PopularExerciseChart from "./workout/PopularExerciseChart";
import WorkoutSessions from "./workout/WorkoutSessions";

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
            maxWidth: {xs: '95%', lg: '90%'},
            padding: '20px',
            margin: '0 auto',
            color: 'white',
            minWidth: {xs: '80%', lg: '55%'},
        }}
        >
            <Button sx={{
                position: 'absolute',
                top: 10,
                right: 10
            }} onClick={handleAddWorkoutButton}>Dodaj trening</Button>
            <WorkoutSessionDialog open={openDialog} onClose={handleDialogClose} Transition={Transition}
                                  onWorkoutAdded={handleWorkoutAdded}/>
            <GeneralStatsCard refresh={refresh}/>
            <PopularExerciseChart refresh={refresh}/>
            <WorkoutSessions refresh={refresh} onWorkoutChanged={handleWorkoutAdded}/>
        </Box>
    );
};

export default MainStats;