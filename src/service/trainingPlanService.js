import axiosInstance from "../utils/axiosInstance";
import qs from "qs";

export const getAllTrainingPlans = async (params) => {
    try {
        const response = await axiosInstance.get('/plan', {
            params,
            paramsSerializer: (params) => {
                return qs.stringify(params, { arrayFormat: 'repeat' });
            },
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getTrainingPlanById = async (id) => {
    try {
        const response = await axiosInstance.get(`/plan/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching training plan by ID:", error);
        throw error;
    }
};

export const createTrainingPlan = async (data) => {
    try {
        const response = await axiosInstance.post("/plan", data);
        return response.data;
    } catch (error) {
        console.error("Error creating training plan:", error);
        throw error;
    }
};

export const updateTrainingPlan = async (id, values) => {
    try {
        const response = await axiosInstance.put(`/plan/${id}`, values);
        return response.data;
    } catch (error) {
        console.error("Error updating training plan:", error);
        throw error;
    }
};

export const deleteTrainingPlan = async (id) => {
    try {
        const response = await axiosInstance.delete(`/plan/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting training plan:", error);
        throw error;
    }
};

export const addLike = async (id, isLike) => {
    try {
        const response = await axiosInstance.post(`/likes/${id}`, { isLike });
        return response.data;
    } catch (error) {
        console.error("Error adding like:", error);
        throw error;
    }
};

export const getLikeCount = async (id) => {
    try {
        const response = await axiosInstance.get(`/likes/${id}/count`);
        return response.data;
    } catch (error) {
        console.error("Error fetching like count:", error);
        throw error;
    }
};

export const getComments = async (id, params) => {
    try {
        const response = await axiosInstance.get(`/comments/${id}`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching comments:", error);
        throw error;
    }
};

export const addComment = async (id, content) => {
    try {
        const response = await axiosInstance.post(`/comments/${id}`, { content });
        return response.data;
    } catch (error) {
        console.error("Error adding comment:", error);
        throw error;
    }
};

export const deleteComment = async (trainingPlanId, commentId) => {
    try {
        const response = await axiosInstance.delete(`/comments/${trainingPlanId}/${commentId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting comment:", error);
        throw error;
    }
};

export const updateComment = async (trainingPlanId, commentId, content) => {
    try {
        const response = await axiosInstance.put(`/comments/${trainingPlanId}/${commentId}`, { content });
        return response.data;
    } catch (error) {
        console.error("Error updating comment:", error);
        throw error;
    }
};

export const toggleFavorite = async (id) => {
    try {
        const response = await axiosInstance.post(`/plan/${id}/favorite`, {id});
        return response.data;
    } catch (error) {
        console.error("Error adding like:", error);
        throw error;
    }
}