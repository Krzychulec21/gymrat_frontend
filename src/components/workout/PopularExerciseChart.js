import React, {useEffect, useState} from "react";
import {getTopCategoriesForUser} from "../../service/workoutService";
import {Box, Typography} from "@mui/material";
import {PieChart} from '@mui/x-charts/PieChart';

const PopularExerciseChart = ({refresh}) => {
    const [topCategories, setTopCategories] = useState([]);

    const loadTopCategoriesForUser = async () => {
        const data = await getTopCategoriesForUser();
        setTopCategories(data);
    }

    useEffect(() => {
        loadTopCategoriesForUser();
    }, [refresh]);

    const valueFormatter = (item: { value: number }) => `${item.value}%`;

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            mt: 6,
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
        }}>
            <Typography variant='h5'>
                Najczęściej trenowane partie mięśniowe.
            </Typography>


            {topCategories && topCategories.length > 0 ? (
                <Box sx={{display: ' flex', alignItems: 'center', mt: 2, width: '100%', flexWrap: 'colum'}}>
                    <PieChart
                        margin={{top: 50, bottom: 50, left: 59, right: 50}}
                        series={[{
                            data: topCategories.map(item => ({
                                label: item.category + ' ' + item.percentage + '%',
                                value: item.percentage
                            })),
                            highlightScope: {fade: 'global', highlight: 'item'},
                            faded: {innerRadius: 30, additionalRadius: -30, color: 'gray'},
                            valueFormatter: valueFormatter,
                            animation: {
                                duration: 3000
                            },
                        },
                        ]}
                        height={340}
                        slotProps={{
                            legend: {
                                direction: 'row',
                                position: {vertical: 'top', horizontal: 'middle'},
                                padding: 0,
                            },
                        }}
                    />
                </Box>
            ) : (
                <Typography variant="body1">Brak danych do wyświetlenia</Typography>
            )}

        </Box>
    );
};

export default PopularExerciseChart;
