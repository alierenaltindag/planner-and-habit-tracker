export class APIError extends Error {
    info: any;
    status: number;

    constructor(message: string, info: any, status: number) {
        super(message);
        this.info = info;
        this.status = status;
    }
}

export const fetcher = async (url: string) => {
    const res = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            // Prevent browser caching
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
        },
        // Include credentials if using cookies (though we are using JWT in body/header mostly, 
        // but good practice if we switch to httpOnly cookies)
        credentials: 'include',
    });

    if (!res.ok) {
        const errorInfo = await res.json().catch(() => ({}));
        throw new APIError('An error occurred while fetching the data.', errorInfo, res.status);
    }

    return res.json();
};
