import React from "react";
import {
  Plane,
  Coffee,
  UtensilsCrossed,
  Hotel,
  Bus,
  ShoppingBag,
  MessagesSquare,
  Briefcase,
  Compass,
  User,
  Bot,
  Sparkles,
  Headphones,
  LucideProps,
} from "lucide-react";

interface TopicIconProps extends LucideProps {
  topicId: string;
}

export const TopicIcon: React.FC<TopicIconProps> = ({ topicId, ...props }) => {
  switch (topicId) {
    case "airport":
      return <Plane {...props} />;
    case "cafe":
      return <Coffee {...props} />;
    case "restaurant":
      return <UtensilsCrossed {...props} />;
    case "hotel":
      return <Hotel {...props} />;
    case "transportation":
      return <Bus {...props} />;
    case "shopping":
      return <ShoppingBag {...props} />;
    case "socializing":
      return <MessagesSquare {...props} />;
    case "workplace":
      return <Briefcase {...props} />;
    default:
      return <Compass {...props} />;
  }
};

interface RoleIconProps extends LucideProps {
  role: "user" | "ai";
}

export const RoleIcon: React.FC<RoleIconProps> = ({ role, ...props }) => {
  if (role === "user") {
    return <User {...props} />;
  }
  return <Sparkles {...props} />;
};
