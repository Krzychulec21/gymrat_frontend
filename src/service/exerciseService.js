import axiosInstance from "../utils/axiosInstance";

export const getAllExercises = async () => {
    try {
        const response = await axiosInstance.get("/exercise");
        return response.data;
    } catch (error) {
        console.error("Error fetching exercises:", error);
        throw error;
    }
};


export const getExercisesTrainedByUser = async () => {
    try {
        const response = await axiosInstance.get('/exercise/trained');
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getAllExercisesPaginate = async (page = 0, size = 8, sortBy = 'category', sortDir = 'asc') => {
    try {
        const response = await axiosInstance.get('/exercise/paginate', {
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

export const saveExercise = async (exerciseData) => {
    try {
        await axiosInstance.post("/exercise", exerciseData);
    } catch (error) {
        console.error("Error saving exercise: ", error);
        throw error;
    }
}

export const updateExercise = async (id, exerciseData) => {
    try {
        await axiosInstance.put(`/exercise/${id}`, exerciseData);
    } catch (error) {
        console.error("Error updating exercise: ", error);
        throw error;
    }
};


