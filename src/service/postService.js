import axiosInstance from "../utils/axiosInstance";
export const addPost = async (workoutId, description, photo) => {
    const formData = new FormData();
    formData.append('workoutId', workoutId.toString());
    formData.append('description', description);

    if (photo) {
        formData.append('photo', photo);
    }

    try {
        const response = await axiosInstance.post('/posts', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error adding post:', error);
        throw error;
    }
};

export const getUserPosts = async (userId) => {
    try {
        const url = userId ? `/posts/user/${userId}` : '/posts';
        const response = await axiosInstance.get(url);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch user posts:", error);
        throw error;
    }
};


export const addReaction = async (postId) => {
    await axiosInstance.post(`/posts/${postId}/reactions`);
};

export const removeReaction = async (postId) => {
    await axiosInstance.delete(`/posts/${postId}/reactions`);
};
