import React, {useEffect, useState} from "react";
import {getTopCategoriesForUser} from "../../service/workoutService";
import {Box, Typography} from "@mui/material";
import {PieChart} from '@mui/x-charts/PieChart';

const PopularExerciseChart = ({refresh}) => {
    const [topCategories, setTopCategories] = useState([]);

    const categoryMapping = {
        "NOGI": "Nogi",
        "BARKI": "Barki",
        "PLECY": "Plecy",
        "BICEPS": "Biceps",
        "TRICEPS": "Triceps",
        "KLATKA_PIERSIOWA": "Klatka piersiowa",
        "BRZUCH": "Brzuch"
    };

    const loadTopCategoriesForUser = async () => {
        const data = await getTopCategoriesForUser();
        setTopCategories(data);
    }

    useEffect(() => {
        loadTopCategoriesForUser();
    }, [refresh]);

    const valueFormatter = (item) => `${item.value.toFixed(0)}%`;

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            mt: 6,
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            mb:4
        }}>
            <Typography variant='h4'>
                Trenowane partie mięśniowe
            </Typography>


            {topCategories && topCategories.length > 0 ? (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, width: '100%', flexWrap: 'colum' }}>
                    <PieChart
                        margin={{ top: 50, bottom: 50, left: 59, right: 50 }}
                        series={[
                            {
                                data: topCategories.map(item => ({
                                    label: `${categoryMapping[item.category]} `,
                                    value: item.percentage,
                                })),
                                highlightScope: { fade: 'global', highlight: 'item' },
                                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                animation: {
                                    duration: 3000,
                                },
                                valueFormatter,
                            },
                        ]}
                        height={340}
                        slotProps={{
                            legend: {
                                direction: 'row',
                                position: { vertical: 'top', horizontal: 'middle' },
                                padding: 0,
                            },
                            popper: {
                                sx: {
                                    '& .MuiChartsTooltip-valueCell': {
                                        color: 'black !important',
                                    },

                                },
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
