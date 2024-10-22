import MainStats from "../components/MainStats";
import Button from "@mui/material/Button";
import {getNumberOfUserWorkouts} from "../service/workoutService";
import {Box, Card, CardContent, Typography} from "@mui/material";

const StatsPage = () => {
    const handleClick = () => {
        load();
    }

    const load = async () => {
        const number = await getNumberOfUserWorkouts();
        console.log("liczba treningow", number);
    }
    return (
        <>
        <MainStats></MainStats>

            </>
    );
};

export default StatsPage;