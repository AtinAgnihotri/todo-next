// import { TodoTask } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTaskInput } from "~/lib/type-validations";

import {
  createTRPCRouter,
  publicProcedure,
  privateProcedure,
} from "~/server/api/trpc";

export const tasksRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getTasksForUser: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const limit = input.limit ?? 10;
      const { cursor } = input;
      const userId = ctx.currentUserId;
      const todos = await ctx.db.todo.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        where: {
          userId,
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "asc",
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (todos.length > limit) {
        const nextItem = todos.pop();
        nextCursor = nextItem!.id;
      }

      return {
        todos,
        nextCursor,
      };
    }),
  createTask: privateProcedure
    .input(createTaskInput)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.currentUserId;
      const { name, tag, isFavourite, priority, description, status } = input;
      try {
        const task = await ctx.db.todo.create({
          data: {
            userId,
            name,
            tag,
            isFavourite,
            priority,
            desc: description,
            status,
          },
        });
        return task;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong!",
        });
      }
    }),
  deleteTask: privateProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.db.todo.delete({
          where: {
            id: input.id,
          },
        });
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Couldn't delete the task",
        });
      }
    }),
});

/*
 name: string
    tag: string
    status: string
    priority: string
    isFavourite: boolean
    createdAt?: Date | string
    userId: string
    desc: string
*/
