import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { TableTask } from "./schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Todo = {
  id: number;
  name: string;
  tag: string;
  status: string;
  priority: string;
  isFavourite: boolean;
  createdAt: Date;
  userId: string;
  desc: string;
};

export const todoToTask = (data: Todo[] | undefined): TableTask[] => {
  if (!data) return [];
  return data.map(
    ({
      id,
      name,
      tag,
      status,
      priority,
      isFavourite,
      createdAt,
      userId,
      desc,
    }) => ({
      id,
      title: name,
      status,
      label: tag,
      priority,
    }),
  );
};

export const capitaliseFirstLetter = (text: string) => {
  const tokens = text.split("");
  if (!tokens[0]) return text;
  tokens[0] = tokens[0].toUpperCase();
  return tokens.join("");
};
