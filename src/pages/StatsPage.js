import MainStats from "../components/workout/MainStats";
import {getNumberOfUserWorkouts} from "../service/workoutService";

const StatsPage = () => {
    const handleClick = () => {
        load();
    }

    const load = async () => {
        const number = await getNumberOfUserWorkouts();
    }
    return (
        <>
            <MainStats></MainStats>

        </>
    );
};

export default StatsPage;