import { Topic } from "@/types/conversation";
import airportTopic from "./airport.json";
import restaurantTopic from "./restaurant.json";
import hotelTopic from "./hotel.json";
import transportationTopic from "./transportation.json";
import cafeTopic from "./cafe.json";
import shoppingTopic from "./shopping.json";
import socializingTopic from "./socializing.json";
import workplaceTopic from "./workplace.json";

export const ALL_TOPICS: Topic[] = [
  cafeTopic as unknown as Topic,
  airportTopic as unknown as Topic,
  restaurantTopic as unknown as Topic,
  hotelTopic as unknown as Topic,
  transportationTopic as unknown as Topic,
  shoppingTopic as unknown as Topic,
  socializingTopic as unknown as Topic,
  workplaceTopic as unknown as Topic,
];

export function getTopicById(id: string): Topic | undefined {
  return ALL_TOPICS.find((t) => t.id === id);
}

export function getScenarioById(topicId: string, scenarioId: string) {
  const topic = getTopicById(topicId);
  if (!topic) return undefined;
  return topic.scenarios.find((s) => s.id === scenarioId);
}
