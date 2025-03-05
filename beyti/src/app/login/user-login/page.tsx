import LoginForm from "@/components/UserAuthForm/LoginForm"
import Poster from "@/components/Login/Poster"
export default function UserLoginPage() {
    return (
      <main className="flex">
        <div className="w-1/2 flex justify-center items-center">
          <LoginForm />
        </div>
  
        <div className="w-1/2 flex h-screen">
          <Poster dynamicText="More than just a dorm - Find your perfect home away from home!" />
        </div>
      </main>
    );
  }