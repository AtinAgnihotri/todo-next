import { z } from "zod";
import { Priority, Status } from "./types";

export const createTaskInput = z.object({
  name: z.string().min(3).max(200),
  tag: z.string().min(3).max(50),
  status: z.nativeEnum(Status),
  isFavourite: z.boolean(),
  priority: z.nativeEnum(Priority),
  description: z.string(),
});
