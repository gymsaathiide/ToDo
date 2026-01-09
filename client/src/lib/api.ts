import { getSupabase } from "./supabase";

async function getAuthHeader(): Promise<Record<string, string>> {
    const client = await getSupabase();
    const { data } = await client.auth.getSession();
    const token = data.session?.access_token;

    if (!token) {
        return {};
    }

    return {
        Authorization: `Bearer ${token}`
    };
}

export async function apiRequest(
    method: string,
    path: string,
    body?: unknown
): Promise<any> {
    const headers = await getAuthHeader();

    // If we are in production (APK) and path is relative, prefix with our backend URL
    if (import.meta.env.PROD && path.startsWith("/")) {
        path = "https://todo-app-345096009330.asia-south2.run.app" + path;
    }

    const res = await fetch(path, {
        method,
        headers: {
            ...headers,
            "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        let errorMessage = "API request failed";
        try {
            const errorData = await res.json();
            console.error("API Error Response:", errorData); // Log it for debugging
            errorMessage = errorData.message || errorMessage;
            if (errorData.error) {
                errorMessage += `: ${errorData.error}`;
            }
        } catch (e) {
            console.error("Failed to parse API error JSON:", e);
            const text = await res.text();
            console.error("API Error Text:", text);
            errorMessage += ` (Status ${res.status})`;
        }
        throw new Error(errorMessage);
    }

    if (res.status !== 204) {
        return res.json();
    }
}
