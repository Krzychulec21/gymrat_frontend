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
