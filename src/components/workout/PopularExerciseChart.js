import {Cell, Legend, Pie, PieChart, Tooltip} from "recharts";
import React, {useEffect, useState} from "react";
import {getTopCategoriesForUser} from "../../service/workoutService";
import {Box, Typography} from "@mui/material";

const PopularExerciseChart = ({refresh}) => {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    const [topCategories, setTopCategories] = useState([]);


    const loadTopCategoriesForUser = async () => {
        const data = await getTopCategoriesForUser();
        setTopCategories(data);
    }
    useEffect(() => {
        loadTopCategoriesForUser();
    }, [refresh])

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            mt:6,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Typography variant='h5' >
                Najczęściej trenowane partie mięśniowe.
            </Typography>
            <PieChart width={400} height={400} refresh={refresh}>
                <Pie
                    data={topCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="percentage"
                    nameKey="category"
                >
                    {topCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                    ))}
                </Pie>
                <Tooltip/>
                <Legend/>
            </PieChart></Box>
    );
};

export default PopularExerciseChart;