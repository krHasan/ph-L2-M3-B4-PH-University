export const HTTP_METHODS = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
    PATCH: "PATCH",
} as const;

export const httpMethodsArray = Object.values(HTTP_METHODS);
