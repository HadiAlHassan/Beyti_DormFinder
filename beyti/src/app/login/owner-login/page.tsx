import LoginForm from "@/components/OwnerAuthForm/LoginForm"
import Poster from "@/components/Login/Poster"
export default function UserLoginPage() {
    return (
      <main className="flex">
        <div className="w-1/2 flex justify-center items-center">
          <LoginForm />
        </div>
 
        <div className="w-1/2 flex h-screen">
          <Poster dynamicText="Helping students finding dorms made easier for you!" />
        </div>
      </main>
    );
  }