"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { nationalities } from "@/lib/nationalities";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

const MultiStepForm = () => {
  const [step, setStep] = useState(1);

  const months = [
    { value: "jan", label: "January" },
    { value: "feb", label: "February" },
    { value: "mar", label: "March" },
    { value: "apr", label: "April" },
    { value: "may", label: "May" },
    { value: "jun", label: "June" },
    { value: "jul", label: "July" },
    { value: "aug", label: "August" },
    { value: "sep", label: "September" },
    { value: "oct", label: "October" },
    { value: "nov", label: "November" },
    { value: "dec", label: "December" },
  ];

  const dates = Array.from({ length: 31 }, (_, i) => ({
    value: (i + 1).toString(),
    label: (i + 1).toString(),
  }));

  const years = Array.from({ length: 76 }, (_, i) => {
    const year = 1950 + i;
    return { value: year.toString(), label: year.toString() };
  });

  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

  const [alertMessage, setAlertMessage] = useState("");
  
  // Basic Info (Step 1)
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationality, setNationality] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobDate, setDobDate] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [gender, setGender] = useState("female");

  // Additional Info (Step 2)
  const [picture, setPicture] = useState<File | null>(null);
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [legalRecord, setLegalRecord] = useState<File | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");

  // Login Info (Step 3)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");

  // Unified validation function for each step

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    // Check if email contains @ and .com
    if (!emailRegex.test(emailValue)) {
      setAlertMessage("Please include '@...com' in your email.");
    } else {
      setAlertMessage("");
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!firstName.trim()) {
        setError("Please enter your first name.");
        setOpen(true);
        return;
      }
      if (!lastName.trim()) {
        setError("Please enter your last name.");
        setOpen(true);
        return;
      }
      if (!nationality.trim()) {
        setError("Please select your nationality.");
        setOpen(true);
        return;
      }
      if (!homeAddress.trim()) {
        setError("Please enter your home address.");
        setOpen(true);
        return;
      }
      if (!dobMonth || !dobDate || !dobYear) {
        setError("Please select your complete date of birth.");
        setOpen(true);
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!picture) {
        setError("Please upload your picture.");
        setOpen(true);
        return;
      }
      if (!idDocument) {
        setError("Please upload your ID/Passport.");
        setOpen(true);
        return;
      }
      if (!legalRecord) {
        setError("Please upload your Legal Record.");
        setOpen(true);
        return;
      }
      if (!phoneNumber.trim()) {
        setError("Please enter your phone number.");
        setOpen(true);
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!email.trim()) {
        setError("Please enter your email.");
        setOpen(true);
        return;
      }
      if (!password) {
        setError("Please enter your password.");
        setOpen(true);
        return;
      }
      if (password.length < 8) {
        setError("Password must be at least 8 characters long.");
        setOpen(true);
        return;
      }
      if (!confirmPassword) {
        setError("Please confirm your password.");
        setOpen(true);
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        setOpen(true);
        return;
      }
      if (alertMessage.trim()) {
        setError("Please enter the email in correct form.");
        setOpen(true);
        return;
      }
      console.log("All validations passed. Form is ready for submission.");
    }
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="w-full">
      
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Missing Information</AlertDialogTitle>
          <AlertDialogDescription>{error}</AlertDialogDescription>
          <AlertDialogCancel>OK</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>

      <div className="absolute top-0 left-0 w-full">
        <div className="flex items-center justify-between p-3">
          <Progress value={(step / 3) * 100} />
        </div>
        <div className="flex items-center justify-between pr-24 pl-24">
          {["Basic info", "Additional info", "Login info"].map((label, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  step === index + 1
                    ? "bg-emerald-800 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`text-sm ${
                  step === index + 1 ? "text-emerald-800 font-semibold" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="mt-20">
          <h2 className="text-xl font-semibold">Basic Info</h2>
          <p className="text-sm text-gray-500 mb-4">
            *All fields required unless noted.
          </p>

          <Label>* First Name</Label>
          <Input
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mb-4"
          />

          <Label className="mt-3">Middle Name (if applicable)</Label>
          <Input
            placeholder="Enter your middle name"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
            className="mb-4"
          />

          <Label className="mt-3">* Last Name</Label>
          <Input
            placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mb-4"
          />

          <Label className="mt-3">* Nationality</Label>
          <div className="mb-4">
            <Select value={nationality} onValueChange={(value) => setNationality(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select nationality" />
              </SelectTrigger>
              <SelectContent>
                {nationalities.map((nat) => (
                  <SelectItem key={nat.value} value={nat.value}>
                    {nat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Label className="mt-3">* Home Address</Label>
          <Input
            placeholder="Enter your home address"
            value={homeAddress}
            onChange={(e) => setHomeAddress(e.target.value)}
            className="mb-4"
          />

          <Label className="mt-3">* Date of Birth</Label>
          <div className="flex space-x-2 mb-6">
            <Select value={dobMonth} onValueChange={(value) => setDobMonth(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dobDate} onValueChange={(value) => setDobDate(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                {dates.map((date) => (
                  <SelectItem key={date.value} value={date.value}>
                    {date.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dobYear} onValueChange={(value) => setDobYear(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year.value} value={year.value}>
                    {year.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Label>* What's your gender?</Label>
          <RadioGroup
            value={gender}
            onValueChange={(value) => setGender(value)}
            className="flex space-x-4 mb-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Female</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Male</Label>
            </div>
          </RadioGroup>

          <Button className="absolute right-0 bottom-0 mt-2" onClick={handleNext}>
            Next
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold">Additional Info</h2>
          <p className="text-sm text-gray-500 mb-12">
            *All fields required unless noted.
          </p>

          <Label className="block mb-1">* Upload Picture</Label>
          <Input
            type="file"
            className="mb-12"
            onChange={(e) =>
              setPicture(e.target.files ? e.target.files[0] : null)
            }
          />

          <Label className="block mb-1">* Upload ID / Passport</Label>
          <Input
            type="file"
            className="mb-12"
            onChange={(e) =>
              setIdDocument(e.target.files ? e.target.files[0] : null)
            }
          />

          <Label className="block mb-1">* Upload Legal Records</Label>
          <Input
            type="file"
            className="mb-12"
            onChange={(e) =>
              setLegalRecord(e.target.files ? e.target.files[0] : null)
            }
          />

          <Label className="block mb-1">* Phone Number</Label>
          <Input
            type="tel"
            placeholder="Enter your phone number"
            value={phoneNumber}
            className="mb-12"
            onChange={(e) => {
              const numericValue = e.target.value.replace(/\D/g, "");
              setPhoneNumber(numericValue);
            }}
          />


          

          <div className="absolute right-0 bottom-0 flex justify-between">
            <Button onClick={handleNext}>Next</Button>
          </div>
          <div className="absolute left-0 bottom-0 flex justify-between">
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold">Login Info</h2>
          <p className="text-sm text-gray-500 mb-8">
            *All fields required unless noted.
          </p>

          <Label className="block mb-1">* Email</Label>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            className="mb-8"
          />
          {alertMessage && (
          <p className="text-red-500 text-sm -mt-6 mb-8">{alertMessage}</p>
        )}


          <Label className="block mb-1">* Password</Label>
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-8"
          />

          <Label className="block mb-1">* Confirm Password</Label>
          <Input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mb-8"
          />

          <div className="mb-8">
            <Label className="block mb-1">Security Question</Label>
            <Select onValueChange={(value) => setSecurityQuestion(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a security question" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pet">
                  What was your first pet's name?
                </SelectItem>
                <SelectItem value="school">
                  What was the name of your first school?
                </SelectItem>
                <SelectItem value="city">
                  What city was your father born in?
                </SelectItem>
                <SelectItem value="teacher">
                  What was the name of your first teacher?
                </SelectItem>
                <SelectItem value="babysitter">
                  What was the name of your childhood babysitter?
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Label className="block mb-1">Answer</Label>
          <Input
            placeholder="Enter your answer"
            value={securityAnswer}
            onChange={(e) => setSecurityAnswer(e.target.value)}
            className="mb-8"
          />

          <div className="absolute right-0 bottom-0 flex justify-between">
            <Button onClick={handleNext}>Finish</Button>
          </div>
          <div className="absolute left-0 bottom-0 flex justify-between">
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiStepForm;
