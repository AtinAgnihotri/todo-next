import { api } from "~/utils/api";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { createTaskInput } from "~/lib/type-validations";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Priority, Status } from "~/lib/types";
import { useToast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";
import {
  Select,
  SelectLabel,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "./ui/select";
import { capitaliseFirstLetter } from "~/lib/utils";
import { DialogClose } from "@radix-ui/react-dialog";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { LoadingSpinner } from "./loading";

type TFormInputData = z.infer<typeof createTaskInput>;

type TInputForm = {
  isLoading: boolean;
  mutate: (x: TFormInputData) => void;
};

export function InputForm({ isLoading, mutate }: TInputForm) {
  const form = useForm<TFormInputData>({
    resolver: zodResolver(createTaskInput),
    defaultValues: {
      name: "",
      tag: "",
      status: Status.TODO,
      isFavourite: false,
      priority: Priority.LOW,
      description: "",
    },
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

const CreateNew = () => {
  const ctx = api.useContext();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { mutate, isLoading } = api.tasks.createTask.useMutation({
    onSuccess: () => {
      void ctx.tasks.getTasksForUser.invalidate();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Couldn't create the todo. Please try again!",
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
  });

  const handleSubmission = (data: TFormInputData) => {
    mutate(data);
    setDialogOpen(false);
  };

  return isLoading ? (
    <LoadingSpinner size={24} />
  ) : (
    <Dialog open={dialogOpen}>
      <DialogTrigger onClick={() => setDialogOpen(true)}>
        <Button
          variant="default"
          className="h-8 border border-white bg-transparent px-2 hover:bg-white hover:text-black lg:px-3"
        >
          Add New
        </Button>
      </DialogTrigger>
      <DialogContent className="text-white">
        <DialogHeader>
          <DialogTitle>What do you have in mind?</DialogTitle>
        </DialogHeader>
        <InputForm isLoading={isLoading} mutate={handleSubmission} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateNew;
