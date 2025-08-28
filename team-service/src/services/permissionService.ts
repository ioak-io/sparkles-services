import axios from 'axios';
import { APP_REALM } from '../constants';

export const createOrUpdateTeam = async (teamName: string, authToken: string) => {
    const authServiceApi = process.env.AUTH_SERVICE_API;
    const authClientId = process.env.AUTH_CLIENT_ID;

    if (!authServiceApi || !authClientId) {
        console.error("AUTH_SERVICE_API or AUTH_CLIENT_ID not set in environment variables.");
        throw new Error("Authentication service API or client ID is not configured.");
    }

    const url = `${authServiceApi}/admin/${APP_REALM}/team/${teamName}`;
    const payload = {
        clientId: authClientId,
        roles: ["admin", "member"],
        groups: [
            {
                name: "user",
                roles: ["member"]
            },
            {
                name: "admin",
                roles: ["admin", "member"]
            }
        ]
    };

    try {
        const response = await axios.post(url, payload, {
            headers: {
                Authorization: authToken
            }
        });
        console.log(`Permission service response for ${teamName}:`, response.data);
        return response.data;
    } catch (error: any) {
        console.error(`Error calling permission service for ${teamName}:`, error.message);
        throw new Error(`Failed to create or update team permissions: ${error.message}`);
    }
};

export const addUserToGroup = async (teamName: string, userId: string, groupNames: string[], authToken: string) => {
    const authServiceApi = process.env.AUTH_SERVICE_API;

    if (!authServiceApi) {
        console.error("AUTH_SERVICE_API not set in environment variables.");
        throw new Error("Authentication service API is not configured.");
    }

    const url = `${authServiceApi}/admin/${APP_REALM}/team/${teamName}/users/${userId}`;
    const payload = groupNames;

    try {
        const response = await axios.post(url, payload, {
            headers: {
                Authorization: authToken
            }
        });
        console.log(`Permission service response for adding user ${userId} to groups in ${teamName}:`, response.data);
        return response.data;
    } catch (error: any) {
        console.error(`Error calling permission service to add user ${userId} to groups in ${teamName}:`, error.message);
        throw new Error(`Failed to add user to groups: ${error.message}`);
    }
};

export const removeUserFromGroup = async (teamName: string, userId: string, groupNames: string[], authToken: string) => {
    const authServiceApi = process.env.AUTH_SERVICE_API;

    if (!authServiceApi) {
        console.error("AUTH_SERVICE_API not set in environment variables.");
        throw new Error("Authentication service API is not configured.");
    }

    const url = `${authServiceApi}/auth/admin/${APP_REALM}/teams/${teamName}/users/${userId}`;
    const payload = groupNames;

    try {
        const response = await axios.delete(url, { data: payload, headers: { Authorization: authToken } });
        console.log(`Permission service response for removing user ${userId} from groups in ${teamName}:`, response.data);
        return response.data;
    } catch (error: any) {
        console.error(`Error calling permission service to remove user ${userId} from groups in ${teamName}:`, error.message);
        throw new Error(`Failed to remove user from groups: ${error.message}`);
    }
};

export const deleteTeam = async (teamName: string, authToken: string) => {
    const authServiceApi = process.env.AUTH_SERVICE_API;
    const authClientId = process.env.AUTH_CLIENT_ID;

    if (!authServiceApi || !authClientId) {
        console.error("AUTH_SERVICE_API or AUTH_CLIENT_ID not set in environment variables.");
        throw new Error("Authentication service API or client ID is not configured.");
    }

    const url = `${authServiceApi}/admin/${APP_REALM}/team/${teamName}`;
    const payload = {
        clientId: authClientId
    };

    try {
        const response = await axios.delete(url, { data: payload, headers: { Authorization: authToken } });
        console.log(`Permission service response for deleting team ${teamName}:`, response.data);
        return response.data;
    } catch (error: any) {
        console.error(`Error calling permission service to delete team ${teamName}:`, error.message);
        throw new Error(`Failed to delete team permissions: ${error.message}`);
    }
};
