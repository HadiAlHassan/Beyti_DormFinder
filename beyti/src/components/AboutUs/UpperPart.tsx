import { DollarSign, Home, Layers, Leaf, Shield, Clock } from "lucide-react";
import FeatureCard from "./CardComponent";

const features = [
  { icon: <DollarSign size={28} className="text-green-700" />, text: "Pay As Little As Possible!" },
  { icon: <Home size={28} className="text-green-700" />, text: "Enjoy Wisdom Of Community!" },
  { icon: <Layers size={28} className="text-green-700" />, text: "Let's Somebody Else Take Care Of Landlord!" },
  { icon: <Leaf size={28} className="text-green-700" />, text: "Enjoy Peaceful Environment!" },
  { icon: <Shield size={28} className="text-green-700" />, text: "Stay Safe! Save Money!" },
  { icon: <Clock size={28} className="text-green-700" />, text: "Pay For What You Use!" },
];

const FeatureGrid = () => {
  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      {features.map((feature, index) => (
        <FeatureCard key={index} icon={feature.icon} text={feature.text} />
      ))}
    </div>
  );
};

export default FeatureGrid;
