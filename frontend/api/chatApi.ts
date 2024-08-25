import { LOCAL_API_URL } from "@env"
import axios from 'axios';

const API_URL = `${LOCAL_API_URL}/api/chat`;

export const searchUsers = async (username, currentUser, cursor?) => {
    try {
        const response = await axios.post(`${API_URL}/search_users`, {
            username,
            currentUser,
            cursor
        })
        return response.data
    } catch (error) {
        console.log(error.message)
        throw error.response.data;
    }
}

export const createGroup = async (users, name) => {
    try {
        const response = await axios.post(`${API_URL}/create_group`, {
            users,
            name
        })
        return response.data
    } catch (error) {
        console.log(error.message)
        throw error.response.data;
    }
}

export const getUserGroups = async (userId) => {
    try {
        const response = await axios.post(`${API_URL}/get_user_groups`, {
            userId
        })
        return response.data
    } catch (error) {
        console.log(error.message)
        throw error.response.data;
    }
}