import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createTaskInput } from "~/lib/type-validations";
import { Priority, Status } from "~/lib/types";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "./ui/form";
import { DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "./ui/select";
import { capitaliseFirstLetter } from "~/lib/utils";
import React from "react";

export type TFormInputData = z.infer<typeof createTaskInput>;

type TInputForm = {
  isLoading: boolean;
  mutate: (x: TFormInputData) => void;
  defaultVals?: TFormInputData;
  children?: React.ReactNode;
};

export function InputForm({ isLoading, mutate, defaultVals }: TInputForm) {
  const form = useForm<TFormInputData>({
    resolver: zodResolver(createTaskInput),
    defaultValues: defaultVals
      ? defaultVals
      : {
          name: "",
          tag: "New",
          status: Status.TODO,
          isFavourite: false,
          priority: Priority.LOW,
          description: "",
        },
    //   ? defaultVals
    //   : {
    //       name: "",
    //       tag: "",
    //       status: Status.TODO,
    //       isFavourite: false,
    //       priority: Priority.LOW,
    //       description: "",
    //     },
  });

  const onSubmit = ({
    name,
    priority,
    description,
    tag,
    isFavourite,
  }: TFormInputData) => {
    if (isLoading) return;
    mutate({
      name,
      status: Status.TODO,
      description,
      tag,
      priority,
      isFavourite,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter the name" {...field} />
              </FormControl>

              <FormDescription>Enter the name of the task</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {defaultVals && (
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Status</SelectLabel>
                        {Object.values(Status).map((p) => (
                          <SelectItem key={`${p}`} value={p}>
                            {capitaliseFirstLetter(p)}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>Select the status of the task</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <FormControl>
                <Select {...field} onValueChange={field.onChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Priority</SelectLabel>
                      {Object.values(Priority).map((p) => (
                        <SelectItem key={`${p}`} value={p}>
                          {capitaliseFirstLetter(p)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>Select the priority of the task</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tag"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tag</FormLabel>
              <FormControl>
                <Input placeholder="Tag" {...field} />
              </FormControl>
              <FormDescription>Enter the tag</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description" {...field} />
              </FormControl>
              <FormDescription>Enter the description</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="submit" className="bg-white text-black">
            Submit
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
