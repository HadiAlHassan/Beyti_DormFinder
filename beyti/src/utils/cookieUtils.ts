export const setCookie = (name: string, value: string, minutesToExpire: number,  role: string,) => {
    const d = new Date();
    d.setTime(d.getTime() + minutesToExpire * 60 * 1000);
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/`;
    document.cookie = `userRole=${encodeURIComponent(role)};${expires};path=/`;
  };
  
  export const getCookie = (): { token: string | null; role: string | null } => {
    const cookies = document.cookie.split("; ");
    let token: string | null = null;
    let role: string | null = null;
    for (let cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key === "authToken") {
        token = decodeURIComponent(value);
      }
      if (key === "userRole") {
        role = decodeURIComponent(value);
      }
    }
    return { token, role };
  };