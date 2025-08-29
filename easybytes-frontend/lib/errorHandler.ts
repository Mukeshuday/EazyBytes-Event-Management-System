// easybytes-frontend/lib/errorHandler.ts

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export function handleApiError(err: unknown, fallback: string = "Something went wrong ❌") {
  if (err && typeof err === "object" && "response" in err) {
    const error = err as ApiError;
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
}
