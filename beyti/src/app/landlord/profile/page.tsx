"use client";

import { getCookie } from "@/utils/cookieUtils";

export default function Page() {
  const { userId} = getCookie(); // ✅ Get Id from cookies

  return <>Welome Back Sir! 
  Your id is {userId}
  
  <br />
  you are now in the profile page
  
  </>;
}
