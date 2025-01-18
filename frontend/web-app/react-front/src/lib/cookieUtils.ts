
const getIdTokenFromCookies = (): string => {
    const matches = document.cookie.match(/^(.*;)?\s*idToken\s*=\s*([^;]*)(.*)?$/);
    return matches ? decodeURIComponent(matches[2]) : '';
  };

const getRoleFromCookies = (): string => {
    const matches = document.cookie.match(/^(.*;)?\s*Role\s*=\s*([^;]*)(.*)?$/);
    return matches ? decodeURIComponent(matches[2]) : '';
  };

const setIdTokenCookie = (idToken: string, Role: string) => {
    const date = new Date();
    
    date.setTime(date.getTime() + (1 * 24 * 60 * 60 * 1000)); // 1 days in milliseconds
    const expires = "expires=" + date.toUTCString();
    document.cookie = `idToken=${encodeURIComponent(idToken)}; path=/; ${expires}; secure; SameSite=Strict`;
    document.cookie = `Role=${encodeURIComponent(Role)}; path=/; ${expires}; secure; SameSite=Strict`;
  };

const isTokenExpired = (token: string): boolean => {
    if (!token || typeof token !== 'string') {
        console.log('Token is missing or invalid. Please log in again.');
        return true;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
        console.log('Token is malformed. Expected 3 parts but got:', parts.length);
        return true;
    }

    try {
        const payload = JSON.parse(atob(parts[1]));
        if (!payload.exp) {
            console.log('Expiration claim is missing. Please log in again.');
            return true;
        }
        return Date.now() >= payload.exp * 1000;
    } catch (error) {
        console.log('Error decoding token. Please log in again.', error);
        return true;
    }
};


const clearCookies = () => {
    const cookies = document.cookie.split(";");

    for (const cookie of cookies) {
        const cookieName = cookie.split("=")[0].trim();
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
    }
};

export {getIdTokenFromCookies, getRoleFromCookies, isTokenExpired, setIdTokenCookie, clearCookies}
