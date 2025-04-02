"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {logIn} from "@/utils/LogInAPI";
import { Checkbox } from "../ui/checkbox";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "../ui/alert-dialog";
import Link from "next/link";

const LoginForm = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Student");
  const [emailOrID, setEmailOrID] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleLogin = async () => {
    if (!emailOrID.trim() || !password.trim()) {
      setAlertMessage("Please fill in all fields.");
      setAlertOpen(true);
      return;
    }
    if (password.length < 8) {
      setAlertMessage("Password must be at least 8 characters long.");
      setAlertOpen(true);
      return;
    }

    const response = await logIn(emailOrID, password, rememberMe);

    if (response.success) {
      const studentId = response.profile;  
      window.location.href = `/student/${studentId}`;
    } else {
      setAlertMessage(response.message);
      setAlertOpen(true);
    }
  };

  return (
    <div className="flex justify-center items-center  bg-gray-100 rounded-3xl enlarge">
      {/* Shadcn AlertDialog for Validation Errors */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Missing Information</AlertDialogTitle>
          <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
          <AlertDialogCancel>OK</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>

      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center dark:text-black">Log In</h2>
        <p className="text-gray-600 text-center">Welcome Back Sailor!</p>

        <div className="flex gap-2 mt-4 justify-center">
          <Button
            variant={selectedRole === "Student" ? "default" : "outline"}
            className="px-4 py-2 rounded-full"
            onClick={() => setSelectedRole("Student")}
          >
            Student
          </Button>
          <Link href="/login/owner-login">
          <Button
            variant={selectedRole === "Landlord" ? "default" : "outline"}
            className="px-4 py-2 rounded-full"
            onClick={() => setSelectedRole("Landlord")}
          >
            Landlord
          </Button>
          </Link>
        </div>

        <div className="mt-4 dark:text-black">
          <Label>LAU Email (without @lau.edu) or LAU ID</Label>
          <Input
            type="text"
            placeholder="Enter your email or ID"
            value={emailOrID}
            onChange={(e) => setEmailOrID(e.target.value)}
            className="mt-1"
          />
        </div>

        <div className="mt-4 dark:text-black">
          <Label>Password</Label>
          <div className="relative">
            <Input
              type={passwordVisible ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="absolute top-1/2 right-0 transform -translate-y-1/2 text-emerald-800"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
            </Button>
          </div>
        </div>

        <div className="mt-4 flex items-center">
        <Checkbox
          id="remember"
          className="mr-2"
          checked={rememberMe}
          onCheckedChange={() => setRememberMe(!rememberMe)}
        />
          <Label htmlFor="remember" className="text-gray-700">
            Keep me signed in
          </Label>
        </div>

        <div className="mt-2">
        <Link href="/forgot-password" className="text-sm text-emerald-800 font-semibold">
          Forget password?
        </Link>
        </div>
        <div className="mt-4">
          <a href="/signup/user-signup" className="text-sm text-black font-semibold">
            Don’t have an Account?{" "}
            <span className="text-emerald-800">Create one</span>
          </a>
        </div>
        <Button className="w-full mt-6" onClick={handleLogin}>
          Log In
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
