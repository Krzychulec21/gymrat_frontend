import React, { useEffect, useState } from 'react';
import { getExerciseOneRepMaxProgress } from '../../service/workoutService';
import { getExercisesTrainedByUser } from '../../service/exerciseService';
import { LineChart } from '@mui/x-charts/LineChart';
import { Box, Select, MenuItem, Typography, IconButton, Tooltip, Dialog, DialogContent, DialogTitle } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const ExerciseOneRepMaxChart = () => {
    const [exercises, setExercises] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState('');
    const [dataPoints, setDataPoints] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        getExercisesTrainedByUser().then(exercises => {
            setExercises(exercises);
            if (exercises.length > 0) {
                setSelectedExercise(exercises[0].id);
            }
        });
    }, []);

    useEffect(() => {
        if (selectedExercise) {
            getExerciseOneRepMaxProgress(selectedExercise).then(data => {
                const validData = data.filter(dp =>
                    dp.date && !isNaN(new Date(dp.date).getTime()) && !isNaN(dp.oneRepMax)
                );
                setDataPoints(validData);
            });
        }
    }, [selectedExercise]);




    const handleExerciseChange = (event) => {
        setSelectedExercise(event.target.value);
    };

    const openDialog = () => {
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
    };

    return (
        <Box sx={{ mt: 8, mb: '24px !important', maxWidth: {lg:'80%'}, margin: 'auto', backgroundColor:'#252525', borderRadius:'10px', padding:'10px'}}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h4">
                    Progres szacowanego 1RM
                </Typography>
                <Tooltip title="Informacje o wykresie">
                    <IconButton onClick={openDialog}>
                        <HelpOutlineIcon/>
                    </IconButton>
                </Tooltip>
            </Box>
            {exercises.length > 0 && (
                <Select
                    value={selectedExercise}
                    onChange={handleExerciseChange}
                    sx={{ mt: 2 }}
                >
                    {exercises.map(exercise => (
                        <MenuItem key={exercise.id} value={exercise.id}>
                            {exercise.name}
                        </MenuItem>
                    ))}
                </Select>
            )}
            {dataPoints.length > 0 ? (
                <LineChart
                    xAxis={[{
                        data: dataPoints.map(dp => new Date(dp.date)),
                        label: 'Data',
                        scaleType: 'time',
                        valueFormatter: (date) => new Date(date).toLocaleDateString('pl-PL')
                    }]}
                    series={[{
                        data: dataPoints.map(dp => Math.round(dp.oneRepMax * 10)/10),
                        label: 'Szacowany 1RM (kg)'
                    }]}
                    height={400}
                    sx={{ mt: 4 }}
                />
            ) : (
                <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                    Brak danych do wyświetlenia
                </Typography>
            )}




            <Dialog open={dialogOpen} onClose={closeDialog}>
                <DialogTitle>Informacje o wykresie</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Wykres przedstawia szacowany maksymalny ciężar, jaki możesz podnieść na jedno powtórzenie (1RM) dla wybranego ćwiczenia, obliczony za pomocą formuły Epleya:
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2, fontStyle: 'italic' }}>
                        1RM = Waga × (1 + Powtórzenia / 30)
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        Dzięki temu możesz śledzić swój progres siłowy w czasie.
                    </Typography>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default ExerciseOneRepMaxChart;
