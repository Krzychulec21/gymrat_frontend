import React, {useEffect, useState} from 'react';
import {BarChart} from '@mui/x-charts/BarChart';
import {Box, Button, Typography} from '@mui/material';
import {getTrainedCategoriesCount, getTrainedExercisesCount} from '../../service/workoutService';
import {axisClasses} from "@mui/x-charts";
import {useTranslation} from "react-i18next";

const TrainedMuscleGroupsChart = () => {
    const [data, setData] = useState([]);
    const [mode, setMode] = useState('categories');
    const categoryMapping = {
        "NOGI": "Nogi",
        "BARKI": "Barki",
        "PLECY": "Plecy",
        "BICEPS": "Biceps",
        "TRICEPS": "Triceps",
        "KLATKA_PIERSIOWA": "Klatka piersiowa",
        "BRZUCH": "Brzuch"
    };
    const {t} = useTranslation('statsPage')

    useEffect(() => {
        if (mode === 'categories') {
            getTrainedCategoriesCount()
                .then(categories => {
                    setData(categories);
                })
                .catch(error => {
                    console.error('[useEffect] Error fetching categories:', error);
                });
        } else {
            getTrainedExercisesCount()
                .then(exercises => {
                    const topExercises = exercises.slice(0, 20);
                    const otherCount = exercises.slice(20).reduce((sum, ex) => sum + ex.count, 0);
                    if (otherCount > 0) {
                        topExercises.push({exerciseName: 'Inne', count: otherCount});
                    }
                    setData(topExercises);
                })
                .catch(error => {
                    console.error('[useEffect] Error fetching exercises:', error);
                });
        }
    }, [mode]);

    const toggleMode = () => {
        setMode(prevMode => (prevMode === 'categories' ? 'exercises' : 'categories'));
    };

    const dataset = data.map((item, index) => {
        const mappedItem = {
            name: mode === 'categories' ? categoryMapping[item.category] : item.name,
            count: item.count,
            id: index,
        };
        return mappedItem;
    });

    return (
        <Box sx={{
            mt: 4,
            mb: '48px !important',
            maxWidth: {lg: '80%'},
            margin: 'auto',
            backgroundColor: '#252525',
            borderRadius: '10px',
            padding: '10px'
        }}>
            <Typography variant="h4" align="center">
                {mode === 'categories' ? t('chart.trainedMuscleGroups') : t('chart.trainedExercises')}
            </Typography>
            <Button onClick={toggleMode} variant="contained" sx={{mt: 2}}>
                {mode === 'categories' ? t('button.showExercises') : t('button.showCategories')}
            </Button>
            {data.length > 0 ? (
                <BarChart
                    dataset={dataset}
                    xAxis={[
                        {
                            dataKey: 'name',
                            scaleType: 'band',
                            tickPlacement: 'middle',
                            tickLabelInterval: () => true
                        },
                    ]}
                    yAxis={[
                        {
                            label: t('chart.numberOfDays'),
                            min: 0,
                            tickMinStep: 1,
                        },
                    ]}
                    series={[
                        {
                            color: '#d96e6e',
                            label: t('chart.numberOfDays'),
                            dataKey: 'count',
                            valueFormatter: (value, {dataIndex}) => {
                                const item = dataset[dataIndex];
                                if (!item) return `${value} ${t('labels.days')}`;
                                const daysText = value === 1 ? t('labels.day') : t('labels.days');
                                return `${value} ${daysText}`;
                            },
                            tooltip: true,
                        },
                    ]}
                    height={450}
                    margin={{bottom: 150}}
                    sx={{
                        [`& .${axisClasses.bottom} .${axisClasses.tickLabel}`]: {
                            transform: 'rotate(-25deg)',
                            textAnchor: 'end',
                            whiteSpace: 'normal',
                        },
                    }}
                />

            ) : (
                <Typography variant="body1" align="center" sx={{mt: 2}}>
                    {t('labels.noData')}
                </Typography>
            )}
        </Box>
    );
};

export default TrainedMuscleGroupsChart;
