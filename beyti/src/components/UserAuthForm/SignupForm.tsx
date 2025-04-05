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
import {signUp} from "@/utils/SignUpAPI";

// Main MultiStepForm component
const MultiStepForm = () => {
  // Step indicator and alert state
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  // Arrays for months, dates, and years for date selection
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

  // ----- Step 1: Basic Info -----
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationality, setNationality] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobDate, setDobDate] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [gender, setGender] = useState("female");

  // ----- Step 2: Additional Info -----
  const [picture, setPicture] = useState<File | null>(null);
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [uniStartMonth, setUniStartMonth] = useState("");
  const [uniStartDate, setUniStartDate] = useState("");
  const [uniStartYear, setUniStartYear] = useState("");
  const [uniFinishMonth, setUniFinishMonth] = useState("");
  const [uniFinishDate, setUniFinishDate] = useState("");
  const [uniFinishYear, setUniFinishYear] = useState("");

  // ----- Step 3: Login Info -----
  const [email, setEmail] = useState("");
  const [lauId, setLauId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [security_question, setsecurity_question] = useState("");
  const [security_answer, setsecurity_answer] = useState("");

  // Helper function: converts month abbreviation to numeric format (e.g., "jan" -> "01")
  const monthToNumber = (month: string): string => {
    const mapping: { [key: string]: string } = {
      jan: "01",
      feb: "02",
      mar: "03",
      apr: "04",
      may: "05",
      jun: "06",
      jul: "07",
      aug: "08",
      sep: "09",
      oct: "10",
      nov: "11",
      dec: "12",
    };
    return mapping[month.toLowerCase()] || "00";
  };

  const [emailError, setEmailError] = useState("");


  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 3 * 1024 * 1024) {
        setError("Picture file size must be less than 3MB.");
        setOpen(true);
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("Picture must be an image file (jpg, jpeg, png, etc).");
        setOpen(true);
        return;
      }      
      setPicture(file);
    }
  };

  const handleIdDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 3 * 1024 * 1024) {
        setError("ID document file size must be less than 3MB.");
        setOpen(true);
        return;
      }
      if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
        setError("ID document must be an image or a PDF.");
        setOpen(true);
        return;
      }
      setIdDocument(file);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enteredEmail = e.target.value;
    setEmail(enteredEmail);

    const lauRegex = /^[^@\s]+@lau\.edu$/i; 
    if (!lauRegex.test(enteredEmail) && enteredEmail.trim() !== "") {
      setEmailError("Please enter a valid LAU email ending with @lau.edu");
    } else {
      setEmailError("");
    }
  };

  // Handle next button click with validations
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
      if (!phoneNumber.trim()) {
        setError("Please enter your phone number.");
        setOpen(true);
        return;
      }
      if(isNaN(Number(phoneNumber))){
        setError("The entered value for Phone Number should only be a Number.");
        setOpen(true);
        return;
      }
      
      if (!uniStartMonth || !uniStartDate || !uniStartYear) {
        setError("Please select your university start date.");
        setOpen(true);
        return;
      }
      if (!uniFinishMonth || !uniFinishDate || !uniFinishYear) {
        setError("Please select your university finish date.");
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
      if (emailError) {
        setError(emailError);
        setOpen(true);
        return;
      }
      if (!lauId.trim()) {
        setError("Please enter your LAU ID.");
        setOpen(true);
        return;
      }
      if (lauId.trim().length !== 9) {
        setError("LAU ID must be exactly 8 numbers long.");
        setOpen(true);
        return;
      }
      if(isNaN(Number(lauId))){
        setError("The entered value for LAU ID should only be a Number.");
        setOpen(true);
        return;
      }
      if (!password) {
        setError("Please enter your password.");
        setOpen(true);
        return;
      }
      if (password.length<8) {
        setError("The password must be at least 8 characters in length.");
        setOpen(true);
        return;
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

      if (!passwordRegex.test(password)) {
        setError("Password must include at least 1 uppercase letter, 1 lowercase letter, and 1 special character.");
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

      const trimmedQuestion = security_question.trim();
      const trimmedAnswer = security_answer.trim();

      if (trimmedQuestion && !trimmedAnswer) {
        setError("Please provide a security answer since you entered a security question.");
        setOpen(true);
        return;
      }

      if (trimmedAnswer && !trimmedQuestion) {
        setError("Please provide a security question since you entered a security answer.");
        setOpen(true);
        return;
      }
      
      // All validations passed; submit the form
      handleSubmit();
    }
  };

  // Handle back button
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Submit the form data via the API
  const handleSubmit = async () => {
    // Construct ISO date strings from date parts
    const dob = `${dobYear}-${monthToNumber(dobMonth)}-${dobDate.padStart(2, "0")}`;
    const uni_start_data = `${uniStartYear}-${monthToNumber(uniStartMonth)}-${uniStartDate.padStart(2, "0")}`;
    const uni_end_data = `${uniFinishYear}-${monthToNumber(uniFinishMonth)}-${uniFinishDate.padStart(2, "0")}`;

    // Convert phone number and LAU ID to numbers
    const phoneNum = Number(phoneNumber);
    const lauIdNum = Number(lauId);

    // Call the signUp API function with all the gathered form data
    const result = await signUp(
      firstName,
      middleName.trim() !== "" ? middleName : null,
      lastName,
      nationality,
      homeAddress,
      dob,
      gender,
      picture,
      idDocument,
      phoneNum,
      emergencyContact.trim() !== "" ? emergencyContact : null,
      uni_start_data,
      uni_end_data,
      email,
      lauIdNum,
      password,
      security_question.trim() !== "" ? security_question : "",
      security_answer.trim() !== "" ? security_answer : ""
    );

    // If API returns an error, show alert dialog with error message
    if (!result.success) {
      setError(result.message);
      setOpen(true);
    }
  };

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
                  step === index + 1 ? "bg-emerald-800 text-white" : "bg-gray-300 text-gray-700"
                }`}
              >
                {index + 1}
              </div>
              <span className={`text-sm ${step === index + 1 ? "text-emerald-800 font-semibold" : "text-gray-400"}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="mt-20">
          <h2 className="text-xl font-semibold">Basic Info</h2>
          <p className="text-sm text-gray-500 mb-4">*All fields required unless noted.</p>

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

          <Label>* What&apos;s your gender?</Label>
          <RadioGroup value={gender} onValueChange={(value) => setGender(value)} className="flex space-x-4 mb-4 mt-2">
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
        <div className="mt-16">
          <h2 className="text-lg font-semibold">Additional Info</h2>
          <p className="text-sm text-gray-500 mb-4">*All fields required unless noted.</p>

          <Label className="block mb-1">* Upload Picture</Label>
          <Input
            type="file"
            className="mb-6"
            onChange={handlePictureChange}
          />

          <Label className="block mb-1">* Upload ID / Passport</Label>
          <Input
            type="file"
            className="mb-6"
            onChange={handleIdDocumentChange}
          />

          <Label className="block mb-1">* Phone Number</Label>
          <Input
            type="tel"
            placeholder="Enter your phone number"
            value={phoneNumber}
            className="mb-6"
            onChange={(e) => {
              const numericValue = e.target.value.replace(/\D/g, "");
              setPhoneNumber(numericValue);
            }}
          />

          <Label className="block mb-1">Emergency Contact</Label>
          <Input
            type="tel"
            placeholder="Enter emergency contact( name of the entity and the way to contact it like phone number )"
            value={emergencyContact}
            onChange={(e) => setEmergencyContact(e.target.value)}
            className="mb-6"
          />

          <Label className="mt-3">* When do/did you start the University?</Label>
          <div className="flex space-x-2 mb-6">
            <Select value={uniStartMonth} onValueChange={(value) => setUniStartMonth(value)}>
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

            <Select value={uniStartDate} onValueChange={(value) => setUniStartDate(value)}>
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

            <Select value={uniStartYear} onValueChange={(value) => setUniStartYear(value)}>
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

          <Label className="mt-3">* When do you finish?</Label>
          <div className="flex space-x-2 mb-6">
            <Select value={uniFinishMonth} onValueChange={(value) => setUniFinishMonth(value)}>
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

            <Select value={uniFinishDate} onValueChange={(value) => setUniFinishDate(value)}>
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

            <Select value={uniFinishYear} onValueChange={(value) => setUniFinishYear(value)}>
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
        <div className="mt-16 ">
          <h2 className="text-lg font-semibold">Login Info</h2>
          <p className="text-sm text-gray-500 mb-4">*All fields required unless noted.</p>

          <Label className="block mb-1">* LAU Email</Label>
          <Input
            type="email"
            placeholder="Enter your LAU email"
            value={email}
            onChange={handleEmailChange} 
            className="mb-6"
          />
          {emailError && <p className="text-red-500 text-sm mt-[-20px] mb-4">{emailError}</p>}

          <Label className="block mb-1">* LAU ID</Label>
          <Input
            placeholder="Enter your LAU ID"
            value={lauId}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/\D/g, "");
              setLauId(numericValue);
            }}
            className="mb-6"
          />

          <Label className="block mb-1">* Password</Label>
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-6"
          />

          <Label className="block mb-1">* Confirm Password</Label>
          <Input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mb-6"
          />

          <div className="mb-6">
            <Label className="block mb-1">Security Question</Label>
            <Select onValueChange={(value) => setsecurity_question(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a security question" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pet">What was your first pet&apos;s name?</SelectItem>
                <SelectItem value="school">What was the name of your first school?</SelectItem>
                <SelectItem value="city">What city was your father born in?</SelectItem>
                <SelectItem value="teacher">What was the name of your first teacher?</SelectItem>
                <SelectItem value="babysitter">What was the name of your childhood babysitter?</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Label className="block mb-1">Answer</Label>
          <Input
            placeholder="Enter your answer"
            value={security_answer}
            onChange={(e) => setsecurity_answer(e.target.value)}
            className="mb-6"
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
