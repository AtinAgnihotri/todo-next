import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuRadioGroup,
  // DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  // DropdownMenuSub,
  // DropdownMenuSubContent,
  // DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import { labels } from "~/lib/data";
import { taskSchema } from "~/lib/schema";
import { api } from "~/utils/api";
import { Priority, Status } from "~/lib/types";
import UpdateTask from "./update-task";
import { InputForm, TFormInputData } from "./todo-input-form";
import { useRef, useState } from "react";
import { useToast } from "./ui/use-toast";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

const getStatus = (val: string): Status => {
  const stat = Object.values(Status).find((s) => String(s) === val);
  return stat ?? Status.TODO;
};

const getPriority = (val: string): Priority => {
  const pri = Object.values(Priority).find((s) => String(s) === val);
  return pri ?? Priority.LOW;
};

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task = taskSchema.parse(row.original);
  const id = task.id;
  const ctx = api.useContext();
  const { mutate: mutateDelete } = api.tasks.deleteTask.useMutation({
    onSuccess: () => {
      void ctx.tasks.getTasksForUser.invalidate();
      console.log("THIS HIT 1");
    },
  });
  const { mutate: mutateUpdateFav } = api.tasks.updateFavourite.useMutation({
    onSuccess: () => {
      void ctx.tasks.getTasksForUser.invalidate();
      console.log("THIS HIT 2");
    },
  });
  const { mutate: mutateCreateCopy } = api.tasks.createTask.useMutation({
    onSuccess: () => {
      void ctx.tasks.getTasksForUser.invalidate();
      console.log("THIS HIT 3");
    },
  });
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const check = useRef(0);

  const { mutate, isLoading } = api.tasks.updateTask.useMutation({
    onSuccess: () => {
      void ctx.tasks.getTasksForUser.invalidate();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Couldn't update the todo. Please try again!",
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
  });

  const handleSubmission = (data: TFormInputData) => {
    mutate({ id, task: data });
    setDialogOpen(false);
  };
  // const { mutate: mutateMakeFav } = api.tasks.updateFavourite.useMutation({
  //   onSuccess: () => {
  //     void ctx.tasks.getTasksForUser.invalidate();
  //   },
  // });

  const taskDetails = {
    status: getStatus(task.status),
    priority: getPriority(task.priority),
    name: task.title,
    tag: task.label,
    isFavourite: task.isFavourite,
    description: task.description,
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DialogTrigger className="w-full " asChild>
            {/* <DropdownMenuItem onClick={() => setDialogOpen(true)}> */}
            <DropdownMenuItem>Edit</DropdownMenuItem>
            {/* </DropdownMenuItem> */}
          </DialogTrigger>

          <DropdownMenuItem
            onClick={() => {
              mutateCreateCopy(taskDetails);
            }}
          >
            Make a copy
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              mutateUpdateFav({ id, isFavourite: !task.isFavourite });
            }}
          >
            {task.isFavourite ? "Unf" : "F"}avorite
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          {/* <DropdownMenuSub>
          <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={task.label}>
              {labels.map((label) => (
                <DropdownMenuRadioItem key={label.value} value={label.value}>
                  {label.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub> */}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              mutateDelete({ id });
            }}
          >
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent className="text-white">
        {/* <DialogHeader>
          <DialogTitle>{task.name}</DialogTitle>
        </DialogHeader> */}
        <InputForm
          isLoading={isLoading}
          mutate={handleSubmission}
          defaultVals={taskDetails}
        />
      </DialogContent>
    </Dialog>
  );
}
