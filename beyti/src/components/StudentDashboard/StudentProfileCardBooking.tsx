import React from 'react';
import { UserProfile } from './../../utils/FetchUserAPI'; 
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Props {
  profile: UserProfile & { matchScore?: number }; // matchScore may be present
  onView?: () => void;
}

const StudentProfileCard: React.FC<Props> = ({ profile, onView }) => {
  return (
    <Card className="w-full max-w-md mx-auto shadow-sm rounded-2xl">
      <CardContent className="p-4 flex items-center gap-4">
        {/* Profile Picture */}
        <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center text-xl font-semibold">
          {profile.picture ? (
            <img
              src={`data:${profile.picture.contentType};base64,${profile.picture.data}`}
              alt="Profile"
              className="object-cover w-full h-full"
            />
          ) : (
            `${profile.first_name[0]}${profile.last_name[0]}`
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">
                {profile.first_name} {profile.last_name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {profile.major} | {getYearFromStartDate(profile.uni_start_data)}
              </p>
            </div>
            {/* Match Score Badge */}
            {profile.matchScore !== undefined && (
              <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-xl">
                {profile.matchScore} match{profile.matchScore !== 1 && 'es'}
              </span>
            )}
          </div>

          {/* Lifestyle tags */}
          <div className="flex flex-wrap gap-2 mt-2 text-xs">
            {profile.sleep_schedule && (
              <span className="bg-gray-100 px-2 py-1 rounded">
                {profile.sleep_schedule}
              </span>
            )}
            {profile.cleanliness_level && (
              <span className="bg-gray-100 px-2 py-1 rounded">
                {profile.cleanliness_level}
              </span>
            )}
            {profile.noise_tolerance && (
              <span className="bg-gray-100 px-2 py-1 rounded">
                Noise: {profile.noise_tolerance}
              </span>
            )}
          </div>
        </div>

        {/* Action */}
        <div>
          <Button onClick={onView} size="sm">View</Button>
        </div>
      </CardContent>
    </Card>
  );
};

function getYearFromStartDate(startDate: string): string {
    const start = new Date(startDate);
    const now = new Date();
    let year = now.getFullYear() - start.getFullYear();
  
    const monthDiff = now.getMonth() - start.getMonth();
    const dayDiff = now.getDate() - start.getDate();
  
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      year--;
    }
  
    if (year <= 0) return '1st Year';
    if (year === 1) return '2nd Year';
    if (year === 2) return '3rd Year';
    return '4+ Year';
  }
  

export default StudentProfileCard;
