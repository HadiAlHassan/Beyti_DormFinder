import { setCookie } from "./cookieUtils";

interface PromiseResponse {
    success: boolean;
    message: string;
  }
  
  const signUp = async (
    first_name: string,
    middle_name: string | null,
    last_name: string,
    nationality: string,
    home_address: string,
    dob: string,
    gender: string,
    picture: File | null,
    passport: File | null,
    phone_number: number,
    emergency_contact: string | null,
    uni_start_data: string,
    uni_end_data: string,
    lau_email: string,
    lau_id: number,
    password: string,
    security_question: string | null,
    security_answer: string | null,
  ): Promise<PromiseResponse> => {
    try {
      const formData = new FormData();
      formData.append("first_name", first_name);
      if (middle_name) formData.append("middle_name", middle_name);
      formData.append("last_name", last_name);
      formData.append("nationality", nationality);
      formData.append("home_address", home_address);
      formData.append("dob", dob);
      formData.append("gender", gender);
      if (picture) formData.append("picture", picture);
      if (passport) formData.append("passport", passport);
      formData.append("phone_number", phone_number.toString());
      if (emergency_contact) formData.append("emergency_contact", emergency_contact);
      formData.append("uni_start_data", uni_start_data);
      formData.append("uni_end_data", uni_end_data);
      formData.append("lau_email", lau_email);
      formData.append("lau_id", lau_id.toString());
      formData.append("password", password);
      if (security_question) formData.append("security_question", security_question);
      if (security_answer) formData.append("security_answer", security_answer);
  
      // Updated fetch URL to point to the Express backend on localhost:5000
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        body: formData, // Automatically sets Content-Type to multipart/form-data
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        return { success: false, message: data.message };
      }

      if (data.success) {
      const studentId = data.profile?._id;
      setCookie("authToken", data.jwt, 60, 'student', studentId);
      window.location.href = `/student/${studentId}`;
      }
  
      return { message: data.message, success: data.success };
    } catch (error: any) {
    console.error("Error signing up user:", error);
    return { success: false, message: error.message || "An error occurred while signing up." };
  }
  };

  const signUpOwner = async (
    first_name: string,
    middle_name: string | null,
    last_name: string,
    nationality: string,
    home_address: string,
    dob: string,
    gender: string,
    picture: File | null,
    passport: File | null,
    legalRecord: File | null,
    phone_number: number,
    email: string,
    password: string,
    security_question: string,
    security_answer: string
  ): Promise<PromiseResponse> => {
    try {
      const formData = new FormData();
      formData.append("first_name", first_name);
      if (middle_name) formData.append("middle_name", middle_name);
      formData.append("last_name", last_name);
      formData.append("nationality", nationality);
      formData.append("home_address", home_address);
      formData.append("dob", dob);
      formData.append("gender", gender);
      if (picture) formData.append("picture", picture);
      if (passport) formData.append("passport", passport);
      if (legalRecord) formData.append("legalRecord", legalRecord);
      formData.append("phone_number", phone_number.toString());
      formData.append("email", email);
      formData.append("password", password);
      if (security_question) formData.append("security_question", security_question);
      if (security_answer) formData.append("security_answer", security_answer);
  
      // Updated fetch URL for the owner signup API
      const response = await fetch("http://localhost:5000/signupOwner", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        return { success: false, message: data.message };
      }
  
      if (data.success) {
        const ownerId = data.profile?._id;
        setCookie("authToken", data.jwt, 60, "landlord",ownerId);
        window.location.href = `/landlord/${ownerId}`;
      }
  
      return { message: data.message, success: data.success };
    } catch (error: any) {
      console.error("Error signing up owner:", error);
      return { success: false, message: error.message || "An error occurred while signing up." };
    }
  };
  
export { signUp, signUpOwner };