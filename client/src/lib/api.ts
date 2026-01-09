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
        // try to parse error message
        let errorMessage = "API request failed";
        try {
            const errorData = await res.json();
            errorMessage = errorData.message || errorMessage;
        } catch {
            // ignore
        }
        throw new Error(errorMessage);
    }

    if (res.status !== 204) {
        return res.json();
    }
}
