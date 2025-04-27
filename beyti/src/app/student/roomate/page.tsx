// pages/student-search.tsx
"use client";

import React, { useEffect, useState } from "react";
import { searchStudents } from "@/utils/SearchRoomate";
import { UserProfile } from "@/utils/FetchUserAPI";
import StudentSearchBar from "@/components/StudentDashboard/SearchBarComp";
import StudentProfileCard from "@/components/StudentDashboard/StudentProfileCard";
import StudentProfileViewer from "@/components/StudentDashboard/RoomateViewer";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";

const App: React.FC = () => {
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [lastCriteria, setLastCriteria] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [viewingProfile, setViewingProfile] = useState<UserProfile | null>(null);
  const [isViewingProfile, setIsViewingProfile] = useState(false);
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

  const { profile: currentUser } = useUser();
  
  if (!currentUser) {
    return <div></div>;
  }
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
            onBack={() => {
              setViewingProfile(null);
              setIsViewingProfile(false);
            }}
          />
        )}

        {loading && <LoadingSpinner />}

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
                <StudentProfileCard
                  key={profile.lau_id}
                  profile={profile}
                  onView={() => {
                    setViewingProfile(profile);
                    setIsViewingProfile(true);
                  }}
                />
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
