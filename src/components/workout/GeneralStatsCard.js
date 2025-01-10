import {Box, Typography} from "@mui/material";
import CustomCard from "./CustomCard";
import React, {useEffect, useState} from "react";
import {getDateOfLastWorkout, getNumberOfUserWorkouts, getTotalWeightLiftedByUser} from "../../service/workoutService";

const GeneralStatsCard = ({refresh}) => {
    const [totalWorkouts, setTotalWorkouts] = useState(0);
    const [liftedWeight, setLiftedWeight] = useState(0);
    const [lastWorkoutDate, setLastWorkoutDate] = useState(null);

    const loadTotalWorkouts = async () => {
        const workoutData = await getNumberOfUserWorkouts();
        setTotalWorkouts(workoutData);
    }

    const loadLiftedWeight = async () => {
        const workoutData = await getTotalWeightLiftedByUser();
        if (workoutData < 100000) {
            setLiftedWeight((workoutData / 1000).toFixed(2));
        } else {
            const roundedWeight = Math.round(workoutData / 1000);
            setLiftedWeight(roundedWeight);
        }
    }

    const loadTheLastWorkout = async () => {
        const workoutData = await getDateOfLastWorkout();
        if (workoutData) {
            const date = new Date(workoutData);
            const formattedDate = date.toLocaleDateString('pl-PL', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
            });
            setLastWorkoutDate(formattedDate);
        }
    }

    useEffect(() => {
        loadTotalWorkouts();
        loadLiftedWeight();
        loadTheLastWorkout();
    }, [refresh]);
    return (
        <Box sx={{mt:6, mb:9}}>
            <Typography sx={{textAlign: 'center'}} variant="h4">Statystyki treningów</Typography>
            <Box sx={{
                mt: 4,
                display: 'flex',
                gap: 8,
                ml: 4,
                mr: 4,
                justifyContent: 'center',
                flexWrap: 'wrap',
            }}>
                <CustomCard value={totalWorkouts} title="Łączna liczba treningów"/>
                <CustomCard value={liftedWeight + " t"} title="Suma podniesionych kilogramów"/>
                <CustomCard sx={{fontSize: 10}} value={lastWorkoutDate} title="Ostatni trening"/>
            </Box></Box>
    );
};

export default GeneralStatsCard;