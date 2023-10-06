import { type PropsWithChildren, useState, useEffect, useRef } from "react";
import { api } from "~/utils/api";
import { useToast } from "./ui/use-toast";
import { InputForm, type TFormInputData } from "./todo-input-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { DropdownMenuItem } from "./ui/dropdown-menu";

type TUpdateTask = {
  taskId: number;
  //   children: React.ReactNode;
  task: TFormInputData;
};

const UpdateTask: React.FC<TUpdateTask> = ({ taskId, task }) => {
  const ctx = api.useContext();
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
    mutate({ id: taskId, task: data });
    // setDialogOpen(false);
  };

  useEffect(() => {
    console.log("DIALOG OPEN STATUS", dialogOpen, check.current);
    check.current += 1;
  }, [dialogOpen]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger className="w-full " asChild>
        {/* <DropdownMenuItem onClick={() => setDialogOpen(true)}> */}
        Edit
        {/* </DropdownMenuItem> */}
      </DialogTrigger>
      <DialogContent className="text-white">
        {/* <DialogHeader>
          <DialogTitle>{task.name}</DialogTitle>
        </DialogHeader> */}
        <InputForm
          isLoading={isLoading}
          mutate={handleSubmission}
          defaultVals={task}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTask;
