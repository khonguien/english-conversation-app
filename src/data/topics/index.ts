import { Topic } from "@/types/conversation";
import airportTopic from "./airport.json";
import restaurantTopic from "./restaurant.json";

export const ALL_TOPICS: Topic[] = [
  airportTopic as unknown as Topic,
  restaurantTopic as unknown as Topic,
];

export function getTopicById(id: string): Topic | undefined {
  return ALL_TOPICS.find((t) => t.id === id);
}

export function getScenarioById(topicId: string, scenarioId: string) {
  const topic = getTopicById(topicId);
  if (!topic) return undefined;
  return topic.scenarios.find((s) => s.id === scenarioId);
}
