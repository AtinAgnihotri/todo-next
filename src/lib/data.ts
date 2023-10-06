import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import { Priority, Status } from "./types";

// const todo = Status.TODO;

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
];

export const statuses = [
  {
    value: Status.BACKLOG,
    label: "Backlog",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: Status.TODO,
    label: "Todo",
    icon: CircleIcon,
  },
  {
    value: Status.IN_PROGRESS,
    label: "In Progress",
    icon: StopwatchIcon,
  },
  {
    value: Status.DONE,
    label: "Done",
    icon: CheckCircledIcon,
  },
  {
    value: Status.CANCELLED,
    label: "Canceled",
    icon: CrossCircledIcon,
  },
];

export const priorities = [
  {
    label: "Low",
    value: Priority.LOW,
    icon: ArrowDownIcon,
  },
  {
    label: "Medium",
    value: Priority.MEDIUM,
    icon: ArrowRightIcon,
  },
  {
    label: "High",
    value: Priority.HIGH,
    icon: ArrowUpIcon,
  },
];
