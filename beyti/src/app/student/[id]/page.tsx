"use client";
import React, { useEffect, useState } from 'react';
import { getCookie } from '@/utils/cookieUtils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import StudentProfileCard from '@/components/StudentDashboard/StudentProfileCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import StudentProfileViewer from '@/components/StudentDashboard/RoomateViewer';
// UserProfile interface definition
export interface UserProfile {
  // Basic Info
  first_name: string;
  middle_name?: string;
  last_name: string;
  nationality: string;
  home_address: string;
  dob: string; // Date as ISO string
  gender: string;

  // Contact & University
  phone_number: number;
  emergency_contact?: string;
  lau_email: string;
  lau_id: number;
  uni_start_data: string;
  uni_end_data: string;
  major?: string;

  // Documents (optional if returned)
  picture?: { data: string; contentType: string };
  passport?: { data: string; contentType: string };

  // Preferences & Lifestyle
  bio?: string;
  hobbies?: string[];
  interests?: string[];
  smoking?: boolean;
  drinking?: boolean;
  pets?: string[];
  allergies?: string[];
  sleep_schedule?: "Early Bird" | "Night Owl" | "Flexible";
  cleanliness_level?:
    | "Highly Organized"
    | "Reasonably Tidy"
    | "Casually Clean"
    | "Laid Back"
    | "Open to Discussion";
  noise_tolerance?: "Low" | "Medium" | "High";
  guests_frequency?: "Rarely" | "Occasionally" | "Frequently" | "Flexible";

  // Social
  instagram_handle?: string;
  facebook_link?: string;
  twitter_handle?: string;
  whatsApp_handle?: string;

  // Flags
  isCustomized?: boolean;

  // Optionally: timestamps
  createdAt?: string;
  updatedAt?: string;
}

export async function searchStudents(criteria: Record<string, any>): Promise<{ students: UserProfile[]; totalPages: number }> {
    const { token } = getCookie();
  
    const queryParams = new URLSearchParams();
    Object.keys(criteria).forEach((key) => {
      const value = criteria[key];
      if (key === "ageRange") {
        if (value.min !== '' && value.min !== undefined) queryParams.append("minAge", value.min.toString());
        if (value.max !== '' && value.max !== undefined) queryParams.append("maxAge", value.max.toString());
      } else if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
  
    const url = `http://localhost:5000/api/students?${queryParams.toString()}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch students.");
    }
  
    const data = await res.json();
    return data; // { students: [], totalPages: N }
  }
  
  

// StudentSearchBar component that collects search criteria.
interface StudentSearchBarProps {
  userProfile: UserProfile;
  onSearch: (criteria: any) => void;
}


const dummyProfiles: UserProfile[] = [
    {
      first_name: "Sara",
      last_name: "Ali",
      gender: "female",
      lau_email: "sara.ali@lau.edu",
      lau_id: 123456,
      dob: "2002-03-10",
      phone_number: 12345678,
      home_address: "Beirut",
      nationality: "Lebanese",
      uni_start_data: "2021-09-01",
      uni_end_data: "2025-06-01",
      major: "Computer Science",
      sleep_schedule: "Night Owl",
      cleanliness_level: "Reasonably Tidy",
      noise_tolerance: "Medium",
    },
    {
      first_name: "Lina",
      last_name: "Haddad",
      gender: "female",
      lau_email: "lina.h@lau.edu",
      lau_id: 6543521,
      dob: "2001-08-15",
      phone_number: 87654321,
      home_address: "Tripoli",
      nationality: "Lebanese",
      uni_start_data: "2020-09-01",
      uni_end_data: "2024-06-01",
      major: "Biology",
      sleep_schedule: "Early Bird",
      cleanliness_level: "Highly Organized",
      noise_tolerance: "Low",
    },{
        first_name: "Lina",
        last_name: "Haddad",
        gender: "female",
        lau_email: "lina.h@lau.edu",
        lau_id: 6543213,
        dob: "2001-08-15",
        phone_number: 87654321,
        home_address: "Tripoli",
        nationality: "Lebanese",
        uni_start_data: "2020-09-01",
        uni_end_data: "2024-06-01",
        major: "Biology",
        sleep_schedule: "Early Bird",
        cleanliness_level: "Highly Organized",
        noise_tolerance: "Low",
      },{
        first_name: "Lina",
        last_name: "Haddad",
        gender: "female",
        lau_email: "lina.h@lau.edu",
        lau_id: 6543214,
        dob: "2001-08-15",
        phone_number: 87654321,
        home_address: "Tripoli",
        nationality: "Lebanese",
        uni_start_data: "2020-09-01",
        uni_end_data: "2024-06-01",
        major: "Biology",
        sleep_schedule: "Early Bird",
        cleanliness_level: "Highly Organized",
        noise_tolerance: "Low",
      }
  ];


const StudentSearchBar: React.FC<StudentSearchBarProps> = ({ userProfile, onSearch }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [major, setMajor] = useState('');
  const [ageRange, setAgeRange] = useState<{ min: number | ''; max: number | '' }>({ min: '', max: '' });
  const [smokingPreference, setSmokingPreference] = useState<string>(''); // "ok" or "not"
  const [drinkingPreference, setDrinkingPreference] = useState<string>(''); // "ok" or "not"
  const [year, setYear] = useState<string>(''); // "1", "2", "3", "4+"
  const [sleepSchedule, setSleepSchedule] = useState<string>('');
  const [cleanlinessLevel, setCleanlinessLevel] = useState<string>('');
  const [noiseTolerance, setNoiseTolerance] = useState<string>('');
  const [guestsFrequency, setGuestsFrequency] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Build the search criteria object.
    const criteria = {
      name: searchName, // Can match first, last, or full name.
      major,
      ageRange,
      smoking: smokingPreference, // "ok" means acceptable, "not" means not acceptable.
      drinking: drinkingPreference,
      year,
      sleepSchedule,
      cleanlinessLevel,
      noiseTolerance,
      guestsFrequency,
      gender: userProfile.gender, // Only search for users of the same gender.
    };
    onSearch(criteria);
  };  

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md shadow-sm">
      {/* Basic Search Bar */}
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

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="space-y-4 border-t pt-4">
          {/* Major and Age Range */}
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
                  setAgeRange({ ...ageRange, min: e.target.value ? Number(e.target.value) : '' })
                }
                className="w-24"
              />
              <Input
                type="number"
                placeholder="Max Age"
                value={ageRange.max}
                onChange={(e) =>
                  setAgeRange({ ...ageRange, max: e.target.value ? Number(e.target.value) : '' })
                }
                className="w-24"
              />
            </div>
          </div>

          {/* Smoking and Drinking Preferences */}
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

          {/* Year of Study & Lifestyle Preferences */}
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

// Parent component that uses StudentSearchBar and displays search results.
const App: React.FC = () => {
    const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
    const [lastCriteria, setLastCriteria] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [viewingProfile, setViewingProfile] = useState<UserProfile | null>(null);
    const [isViewingProfile, setIsViewingProfile] = useState<boolean>(false);
    const resultsPerPage = 3;
  
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage]);
  
    const handleSearch = async (criteria: any, page = 1) => {
      try {
        setLoading(true);
        const fullCriteria = { ...criteria, page, limit: resultsPerPage };
        const response = await searchStudents(fullCriteria);
        setSearchResults(response.students);
        setTotalPages(response.totalPages);
        setCurrentPage(page);
        setLastCriteria(criteria);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };
  
    const currentUser: UserProfile = {
      first_name: "Jane",
      last_name: "Doe",
      nationality: "American",
      home_address: "123 Main St",
      dob: "2000-01-01T00:00:00.000Z",
      gender: "male",
      phone_number: 1234567890,
      lau_email: "jane.doe@example.com",
      lau_id: 1,
      uni_start_data: "2018-09-01T00:00:00.000Z",
      uni_end_data: "2022-06-01T00:00:00.000Z",
    };
  
    const userUsedFilters = (criteria: any) => {
      return !!(
        criteria.name ||
        criteria.major ||
        criteria.sleepSchedule ||
        criteria.cleanlinessLevel ||
        criteria.noiseTolerance ||
        criteria.guestsFrequency ||
        criteria.smoking ||
        criteria.drinking ||
        (criteria.ageRange?.min || criteria.ageRange?.max)
      );
    };
  
    return (
      <div className="container mx-auto p-4">
        <StudentSearchBar userProfile={currentUser} onSearch={handleSearch} />
        <div className="mt-4">

        {!lastCriteria && searchResults.length === 0 && (
  <div className="text-center py-6">
    <h2 className="text-2xl font-bold text-primary">
      🎯 Let’s find your perfect roommate match!
    </h2>
    <p className="mt-2 text-muted-foreground">
      Use the search filters above to explore students with similar lifestyles.
    </p>
  </div>
)}

{viewingProfile && (
  <StudentProfileViewer
    profile={viewingProfile}
    onBack={() => {setViewingProfile(null);setIsViewingProfile(false); }}
  />
) }



  
          {loading && (
            <LoadingSpinner/>
          )}
  
          {!loading && searchResults.length === 0 && lastCriteria && (
            <p className="text-sm text-center text-muted-foreground mt-4">
              No results found. Try adjusting your filters.
            </p>
          )}
  
          {searchResults.length > 0 && !loading && !isViewingProfile && (
            <>
                      <h2 className="text-xl font-semibold">Search Results:</h2>
  
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {searchResults.map((profile) => (
                  <StudentProfileCard key={profile.lau_id} profile={profile} onView={() => {setViewingProfile(profile);setIsViewingProfile(true);
                  }} />
                ))} 
              </div>
  
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-6 space-x-4">
                  <Button
                    disabled={currentPage === 1}
                    onClick={() => handleSearch(lastCriteria, currentPage - 1)}
                  >
                    Previous
                  </Button>
  
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
  
                  <Button
                    disabled={currentPage === totalPages}
                    onClick={() => handleSearch(lastCriteria, currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };
  
export default App;
