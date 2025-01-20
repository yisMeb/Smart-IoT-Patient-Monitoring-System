const getIdTokenFromCookies = (): string => {
  const matches = document.cookie.match(
    /^(.*;)?\s*idToken\s*=\s*([^;]*)(.*)?$/
  );
  return matches ? decodeURIComponent(matches[2]) : "";
};

const getRoleFromCookies = (): string => {
  const matches = document.cookie.match(/^(.*;)?\s*Role\s*=\s*([^;]*)(.*)?$/);
  return matches ? decodeURIComponent(matches[2]) : "";
};

const getRoleIDFromCookie = (): string | null => {
  const name = "Role_ID=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");

  for (let i = 0; i < cookieArray.length; i++) {
    const cookie = cookieArray[i].trim();
    if (cookie.startsWith(name)) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return "";
};

const setIdTokenCookie = (
  idToken: string,
  Role: string,
  role_specific_id: string
) => {
  const date = new Date();

  date.setTime(date.getTime() + 1 * 24 * 60 * 60 * 1000); // 1 days in milliseconds
  const expires = "expires=" + date.toUTCString();
  document.cookie = `idToken=${encodeURIComponent(
    idToken
  )}; path=/; ${expires}; secure; SameSite=Strict`;
  document.cookie = `Role=${encodeURIComponent(
    Role
  )}; path=/; ${expires}; secure; SameSite=Strict`;
  document.cookie = `Role_ID=${encodeURIComponent(
    role_specific_id
  )}; path=/; ${expires}; secure; SameSite=Strict`;
};

const isTokenExpired = (token: string): boolean => {
  if (!token || typeof token !== "string") {
    console.log("Token is missing or invalid. Please log in again.");
    return true;
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    console.log("Token is malformed. Expected 3 parts but got:", parts.length);
    return true;
  }

  try {
    const payload = JSON.parse(atob(parts[1]));
    if (!payload.exp) {
      console.log("Expiration claim is missing. Please log in again.");
      return true;
    }
    return Date.now() >= payload.exp * 1000;
  } catch (error) {
    console.log("Error decoding token. Please log in again.", error);
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

export {
  getIdTokenFromCookies,
  getRoleFromCookies,
  isTokenExpired,
  setIdTokenCookie,
  getRoleIDFromCookie,
  clearCookies,
};
