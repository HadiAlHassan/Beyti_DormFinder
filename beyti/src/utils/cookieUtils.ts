export const setCookie = (name: string, value: string, minutesToExpire: number) => {
    const d = new Date();
    d.setTime(d.getTime() + minutesToExpire * 60 * 1000);
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/`;
  };
  
  export const getCookie = (name: string): string | null => {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key === name) {
        return decodeURIComponent(value);
      }
    }
    return null;
  };