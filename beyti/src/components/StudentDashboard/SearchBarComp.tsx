// File: components/StudentDashboard/Search/SearchBar.tsx
"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserProfile } from "@/utils/FetchUserAPI";

interface Props {
  userProfile: UserProfile;
  onSearch: (criteria: any) => void;
}

const StudentSearchBar: React.FC<Props> = ({ userProfile, onSearch }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [major, setMajor] = useState("");
  const [ageRange, setAgeRange] = useState<{ min: number | ""; max: number | "" }>({ min: "", max: "" });
  const [smokingPreference, setSmokingPreference] = useState("");
  const [drinkingPreference, setDrinkingPreference] = useState("");
  const [year, setYear] = useState("");
  const [sleepSchedule, setSleepSchedule] = useState("");
  const [cleanlinessLevel, setCleanlinessLevel] = useState("");
  const [noiseTolerance, setNoiseTolerance] = useState("");
  const [guestsFrequency, setGuestsFrequency] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const criteria = {
      name: searchName,
      major,
      ageRange,
      smoking: smokingPreference,
      drinking: drinkingPreference,
      year,
      sleepSchedule,
      cleanlinessLevel,
      noiseTolerance,
      guestsFrequency,
      gender: userProfile.gender,
    };
    onSearch(criteria);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md shadow-sm">
      <div className="flex items-center">
        <Input
          type="text"
          placeholder="Search by name or leave blank to explore all people with your filters"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="flex-1"
        />
        <Button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="ml-2">
          {showAdvanced ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </Button>
        <Button type="submit" className="ml-2">
          Search
        </Button>
      </div>

      {showAdvanced && (
        <div className="space-y-4 border-t pt-4">
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <Input
              type="text"
              placeholder="Major..."
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="flex-1"
            />
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="Min Age"
                value={ageRange.min}
                onChange={(e) =>
                  setAgeRange({ ...ageRange, min: e.target.value ? Number(e.target.value) : "" })
                }
                className="w-24"
              />
              <Input
                type="number"
                placeholder="Max Age"
                value={ageRange.max}
                onChange={(e) =>
                  setAgeRange({ ...ageRange, max: e.target.value ? Number(e.target.value) : "" })
                }
                className="w-24"
              />
            </div>
          </div>

          <div className="flex space-x-8">
            <div>
              <label className="block text-sm font-medium mb-1">Smoking</label>
              <RadioGroup
                value={smokingPreference}
                onValueChange={(value) => setSmokingPreference(value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="ok" id="smoking-ok" />
                  <label htmlFor="smoking-ok" className="text-sm">It's ok</label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="not" id="smoking-not" />
                  <label htmlFor="smoking-not" className="text-sm">Not acceptable</label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Drinking</label>
              <RadioGroup
                value={drinkingPreference}
                onValueChange={(value) => setDrinkingPreference(value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="ok" id="drinking-ok" />
                  <label htmlFor="drinking-ok" className="text-sm">It's ok</label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="not" id="drinking-not" />
                  <label htmlFor="drinking-not" className="text-sm">Not acceptable</label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div>
              <label className="block text-sm font-medium mb-1">Year of Study</label>
              <Select value={year} onValueChange={(val) => setYear(val)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">First Year</SelectItem>
                  <SelectItem value="2">Second Year</SelectItem>
                  <SelectItem value="3">Third Year</SelectItem>
                  <SelectItem value="4+">4+ Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Sleep Schedule</label>
              <Select value={sleepSchedule} onValueChange={(val) => setSleepSchedule(val)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select sleep schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Early Bird">Early Bird</SelectItem>
                  <SelectItem value="Night Owl">Night Owl</SelectItem>
                  <SelectItem value="Flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div>
              <label className="block text-sm font-medium mb-1">Cleanliness Level</label>
              <Select value={cleanlinessLevel} onValueChange={(val) => setCleanlinessLevel(val)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select cleanliness" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Highly Organized">Highly Organized</SelectItem>
                  <SelectItem value="Reasonably Tidy">Reasonably Tidy</SelectItem>
                  <SelectItem value="Casually Clean">Casually Clean</SelectItem>
                  <SelectItem value="Laid Back">Laid Back</SelectItem>
                  <SelectItem value="Open to Discussion">Open to Discussion</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Noise Tolerance</label>
              <Select value={noiseTolerance} onValueChange={(val) => setNoiseTolerance(val)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select tolerance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Guests Frequency</label>
              <Select value={guestsFrequency} onValueChange={(val) => setGuestsFrequency(val)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rarely">Rarely</SelectItem>
                  <SelectItem value="Occasionally">Occasionally</SelectItem>
                  <SelectItem value="Frequently">Frequently</SelectItem>
                  <SelectItem value="Flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default StudentSearchBar;
