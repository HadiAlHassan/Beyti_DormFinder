import { setCookie, getCookie } from "./cookieUtils";

interface PromiseResponse {
  success: boolean;
  message: string;
  token?: string;
}

const logIn = async (
  LAUEmailOrID: string | null,
  password: string,
  rememberMe: boolean
): Promise<PromiseResponse> => {
  try {
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ LAUEmailOrID, password, rememberMe }),
      credentials: "include",
    });

    const data = await response.json();
    console.log("Login response:", data);

    if (data.success) {
      const expiryMinutes = rememberMe ? 4320 : 60;
      setCookie("authToken", data.jwt, expiryMinutes, 'student');
      return { success: true, message: "Login successful", token: data.jwt };
    }

    return { success: false, message: data.message };
  } catch (error: any) {
    console.error("Error logging in user:", error);
    return { success: false, message: "An error occurred while logging in." };
  }
};

const logInOwner = async (
  email: string,
  password: string,
  rememberMe: boolean
): Promise<PromiseResponse> => {
  try {
    const response = await fetch("http://localhost:5000/loginOwner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, rememberMe }),
      credentials: "include",
    });

    const data = await response.json();
    console.log("Login response:", data);

    if (data.success) {
      const expiryMinutes = rememberMe ? 4320 : 60;
      setCookie("authToken", data.jwt, expiryMinutes, 'landlord');
      return { success: true, message: "Login successful", token: data.jwt };
    }

    return { success: false, message: data.message };
  } catch (error: any) {
    console.error("Error logging in user:", error);
    return { success: false, message: "An error occurred while logging in." };
  }
};

export { logIn, logInOwner, getCookie };
