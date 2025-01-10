import axiosInstance from "../utils/axiosInstance";

export const getUserMedals = async () => {
    const response = await axiosInstance.get("/challenges/user/medals");
    return response.data;
}

export const getAllRanking = async (page = 0, size = 10, sortBy = "totalPoints", sortDir = "desc") => {
    const response = await axiosInstance.get("/challenges/ranking/all", {
        params: {page, size, sortBy, sortDir}
    });
    return response.data;
}

export const getFriendsRanking = async (page = 0, size = 10, sortBy = "totalPoints", sortDir = "desc") => {
    const response = await axiosInstance.get("/challenges/ranking/friends", {
        params: {page, size, sortBy, sortDir}
    });
    return response.data;
}

export const getUserActiveChallenges = async (page = 0, size = 4, sortBy = "startDate", sortDir = "asc") => {
    const response = await axiosInstance.get("/challenges/user/active", {
        params: {page, size, sortBy, sortDir}
    });
    return response.data;
}

export const getAvailableChallenges = async (page = 0, size = 10, sortBy = "name", sortDir = "asc", publicFilter = null, typeFilter, categoryFilter) => {
    const params = {page, size, sortBy, sortDir, publicFilter};
    if (typeFilter) params.typeFilter = typeFilter;
    if (categoryFilter) params.categoryFilter = categoryFilter;
    const response = await axiosInstance.get("/challenges/user/available", {params});
    return response.data;
}

export const joinChallenge = async (id) => {
    await axiosInstance.post(`/challenges/${id}/participate`);
}

export const getUserHistoryChallenges = async (page = 0, size = 10, sortBy = "name", sortDir = "asc") => {
    const response = await axiosInstance.get("/challenges/user/history", {
        params: {page, size, sortBy, sortDir}
    });
    return response.data;
}

export const getChallengeDetails = async (id) => {
    const response = await axiosInstance.get(`/challenges/${id}/details`);
    return response.data;
}

export const createChallenge = async (challengeData) => {
    const response = await axiosInstance.post("/challenges", challengeData);
    return response.data;
}

export const getChallengeParticipants = async (id, page = 0, size = 10, sortBy = "score", sortDir = "desc") => {
    try {
        const response = await axiosInstance.get(`/challenges/${id}/participants`, {
            params: {page, size, sortBy, sortDir}
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching challenge participants:", error);
        throw error;
    }
};


export const deleteChallenge = async (id) => {
    try {
        await axiosInstance.delete(`/challenges/${id}`);
    } catch (error) {
        console.error("Error deleting challenge:", error);
        throw error;
    }
};

export const getAllChallengeTypes = async () => {
    try {
        const response = await axiosInstance.get("/challenges/types");
        return response.data;
    } catch (error) {
        console.error("Error fetching challenge types:", error);
        throw error;
    }
};


