import { api } from "~/utils/api";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useToast } from "./ui/use-toast";
import { useState } from "react";
import { LoadingSpinner } from "./loading";
import { InputForm, type TFormInputData } from "./todo-input-form";

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
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
