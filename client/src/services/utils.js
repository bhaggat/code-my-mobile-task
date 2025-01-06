export function setCookie(name, value, expiresInSeconds) {
  const date = new Date();
  date.setTime(date.getTime() + expiresInSeconds * 1000);
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}

export function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (let i = 0; i < cookies.length; i++) {
    const [cookieName, cookieValue] = cookies[i].split("=");
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
}

export function deleteCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
}

export function decodeJWT(token) {
  try {
    const payload = token.split(".")[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}
