import axiosInstance from "../utils/axiosInstance";

export const getAllExercises = async () => {
    try {
        const response = await axiosInstance.get("/exercise");
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getExercisesByCategory = async (category) => {
    try {
        const response = await axiosInstance.get(`/exercise/category`, {
            params: {
                category: category,
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const saveWorkoutSession = async (formData) => {
    try {
        const workoutSessionData = {
            date: formData.date,
            note: formData.note,
            exerciseSessions: formData.exercises.map(exercise => ({
                exerciseId: exercise.exerciseId,
                sets: exercise.sets.map(set => ({
                    reps: parseInt(set.reps),
                    weight: parseFloat(set.weight)
                }))
            }))
        };

        console.log("Dane wysyłane do backendu:", workoutSessionData);
        const response = await axiosInstance.post('/workout', workoutSessionData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
