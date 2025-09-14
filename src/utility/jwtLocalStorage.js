// Stores the JWT token in localStorage

export function addToken(jwtToken) {
    if (jwtToken) {
        localStorage.setItem('jwt', jwtToken);
    }
}

// Retrieves the JWT token from localStorage
export function fetchToken() {
    return localStorage.getItem('jwt');
}

// Removes the JWT token from localStorage
export function deleteToken() {
    localStorage.removeItem('jwt');
}