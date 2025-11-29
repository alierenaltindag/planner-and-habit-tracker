import useSWR, { mutate } from 'swr';
import { apiRoutes } from '@/lib/api-config';
import { fetcher } from '@/lib/fetcher';

interface User {
    id: string;
    email: string;
    name?: string;
}

interface UseUserResponse {
    user: User | null;
    isLoading: boolean;
    isError: any;
    logout: () => Promise<void>;
}

export function useUser(): UseUserResponse {
    const { data, error, isLoading } = useSWR(apiRoutes.auth.me(), fetcher, {
        shouldRetryOnError: false, // Don't retry on 401/403
        onError: (err) => {
            if (err.status === 401 || err.status === 403) {
                // Handle auth error (e.g., redirect to login)
                // For now, just let the component handle it or return null user
            }
        }
    });

    const logout = async () => {
        // Optimistic update: clear user immediately
        await mutate(apiRoutes.auth.me(), null, false);

        // Perform actual logout
        try {
            await fetch(apiRoutes.auth.logout(), { method: 'POST' });
        } catch (error) {
            console.error('Logout failed', error);
        }

        // Revalidate to be sure
        mutate(apiRoutes.auth.me());
    };

    return {
        user: data?.data || null, // Assuming API returns { data: user }
        isLoading,
        isError: error,
        logout,
    };
}
