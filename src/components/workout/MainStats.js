import {Box} from "@mui/material";
import Button from "@mui/material/Button";
import React, {useState} from "react";
import Slide from "@mui/material/Slide";
import WorkoutSessionDialog from "./WorkoutSessionDialog";
import GeneralStatsCard from "./GeneralStatsCard";
import PopularExerciseChart from "./PopularExerciseChart";
import WorkoutSessions from "./WorkoutSessions";
import PostDialog from "./PostDialog";
import TrainedMuscleGroupsChart from "./TrainedMuscleGroupsChart";
import ExerciseOneRepMaxChart from "./ExerciseOneRepMaxChart";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const SlideTransition = (props) => {
    return <Slide {...props} direction="down"/>;
};


const MainStats = () => {
    const [refresh, setRefresh] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openPostDialog, setOpenPostDialog] = useState(false);
    const [lastWorkoutId, setLastWorkoutId] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [openSnackbar, setOpenSnackbar] = useState(false);


    const handleDialogClose = (event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return;
        }
        setOpenDialog(false);
    }


    const handleAddWorkoutButton = () => {
        setIsEditMode(false)
        setOpenDialog(true);

    }

    const handleWorkoutAdded = (workoutId, isEditMode) => {
        if (isEditMode === false) {
            setLastWorkoutId(workoutId);
            setOpenPostDialog(true);
        }
        setRefresh(!refresh);
    };

    const handlePostAdded = () => {
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
                                  onWorkoutAdded={handleWorkoutAdded}
                                  isEditMode={isEditMode}
            />
            <GeneralStatsCard refresh={refresh}/>
            <PopularExerciseChart refresh={refresh}/>
            <TrainedMuscleGroupsChart/>
            <ExerciseOneRepMaxChart/>
            <WorkoutSessions refresh={refresh} onWorkoutChanged={handleWorkoutAdded}/>
            <PostDialog
                open={openPostDialog}
                onClose={() => setOpenPostDialog(false)}
                onPostAdded={handlePostAdded}
                workoutId={lastWorkoutId}
            />
        </Box>
    );
};

export default MainStats;