import axiosInstance from "../utils/axiosInstance";

export const getAllExercises = async () => {
    try {
        const response = await axiosInstance.get("/exercise");
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getExerciseInfo = async (id) => {
    try {
        const response = await axiosInstance.get(`/exercise/${id}`)
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
        const response = await axiosInstance.post('/workout', workoutSessionData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getNumberOfUserWorkouts = async () => {
    try {
        const response = await axiosInstance.get(`/workout/count`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getTotalWeightLiftedByUser = async () => {
    try {
        const response = await axiosInstance.get(`/workout/total-weight`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getDateOfLastWorkout = async () => {
    try {
        const response = await axiosInstance.get(`/workout/last-workout`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getTopCategoriesForUser = async () => {
    try {
        const response = await axiosInstance.get(`/workout/top-categories`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getUserWorkouts = async (page = 0, size = 8, sortBy = 'date', sortDir = 'desc') => {
    try {
        const response = await axiosInstance.get('/workout/workouts', {
            params: {
                page,
                size,
                sortBy,
                sortDir
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateWorkoutSession = async (id, formData) => {
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
        const response = await axiosInstance.put(`/workout/${id}`, workoutSessionData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteWorkoutSession = async (id) => {
    try {
        const response = await axiosInstance.delete(`/workout/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getWorkoutSessionById = async (workoutId) => {
    try {
        const response = await axiosInstance.get(`workout/${workoutId}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getTrainedCategoriesCount = async () => {
    try {
        const response = await axiosInstance.get(`/workout/trained-categories-count`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
export const getTrainedExercisesCount = async () => {
    try {
        const response = await axiosInstance.get(`/workout/trained-exercises-count`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getExerciseOneRepMaxProgress = async (exerciseId) => {
    try {
        const response = await axiosInstance.get(`/workout/exercise/${exerciseId}/one-rep-max`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}





