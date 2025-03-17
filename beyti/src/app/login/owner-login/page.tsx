import LoginForm from "@/components/OwnerAuthForm/LoginForm"
import Poster from "@/components/Login/Poster"
import AuthRedirect from "@/components/AuthRedirect";
export default function UserLoginPage() {
    return (
      <AuthRedirect>
      <main className="flex">
        <div className="w-1/2 flex justify-center items-center">
          <LoginForm />
        </div>
 
        <div className="w-1/2 flex h-screen">
          <Poster dynamicText="Helping students finding dorms made easier for you!" />
        </div>
      </main>
      </AuthRedirect>
    );
  }