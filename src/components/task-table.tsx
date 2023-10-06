import { Metadata } from "next";
import Image from "next/image";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import { UserNav } from "./user-nav";
import { TableTask } from "~/lib/schema";

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
};

type TTaskTable = {
  tasks: TableTask[];
  userName: string;
  userImage: string;
  onNewClick: () => void;
  isLoading: boolean;
  setPageSize: (size: number) => void;
  hasPrevCursor?: boolean | undefined;
  hasNextCursor?: boolean | undefined;
  moveToNextPage?: () => void;
  moveToPrevPage?: () => void;
  onSearchChange: (val: string) => void;
};

export default function TaskTable({
  tasks,
  userImage,
  userName,
  onNewClick,
  isLoading,
  setPageSize,
  hasNextCursor,
  hasPrevCursor,
  moveToNextPage,
  moveToPrevPage,
  onSearchChange,
}: TTaskTable) {
  return (
    <>
      <div className="flex h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2 text-white">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              TODO <span className="text-[hsl(280,100%,70%)]">Next</span>
            </h2>
            <p className="text-muted-foreground">
              Here&apos;s the list of your tasks!
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <UserNav avatarImage={userImage} avatarName={userName} />
          </div>
        </div>
        <DataTable
          data={tasks}
          columns={columns}
          onNewClick={onNewClick}
          isLoading={isLoading}
          setPageSize={setPageSize}
          moveToNextPage={moveToNextPage}
          moveToPrevPage={moveToPrevPage}
          hasNextCursor={hasNextCursor}
          hasPrevCursor={hasPrevCursor}
          onSearchChange={onSearchChange}
        />
      </div>
    </>
  );
}
