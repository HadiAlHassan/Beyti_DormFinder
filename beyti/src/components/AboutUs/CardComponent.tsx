import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode; // Accepts any React element (icon)
  text: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, text }) => {
  return (
    <div className="flex flex-col items-center space-y-3 p-4 bg-white shadow-lg rounded-xl">
      <div className="p-3 bg-gray-100 rounded-xl">{icon}</div>

      <p className="text-center text-lg font-semibold text-gray-800">{text}</p>
    </div>
  );
};

export default FeatureCard;
