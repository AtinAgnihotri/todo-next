import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import TaskTable from "./task-table";
import { todoToTask } from "~/lib/utils";

type TDashboard = {
  username: string;
  imageUrl: string;
};

const Dashboard: React.FC<TDashboard> = ({ username, imageUrl }) => {
  const [pageSize, setPageSize] = useState(10);
  const [searchStr, setSearchStr] = useState("");
  const [currentCursor, setCurrentCursor] = useState<number>();
  const [lastCursors, setLastCursors] = useState<number[]>([]);

  const { data, isLoading, isError } = api.tasks.getTasksForUser.useQuery({
    limit: pageSize,
    cursor: currentCursor,
    searchStr,
  });

  useEffect(() => {
    setCurrentCursor(undefined);
    setLastCursors([]);
  }, [pageSize]);

  const handleNextPage = () => {
    if (currentCursor) setLastCursors([...lastCursors, currentCursor]);
    setCurrentCursor(data?.nextCursor);
  };

  const handlePrevPage = () => {
    const cursors = [...lastCursors];
    const lastCursor = cursors.pop();
    setCurrentCursor(lastCursor);
    setLastCursors(cursors);
  };

  return (
    <div className="w-full">
      <TaskTable
        tasks={todoToTask(data?.todos)}
        userName={username}
        userImage={imageUrl}
        onNewClick={() => console.log("Add New")}
        isLoading={isLoading}
        setPageSize={setPageSize}
        hasNextCursor={!!data?.nextCursor}
        hasPrevCursor={!!currentCursor}
        moveToNextPage={handleNextPage}
        moveToPrevPage={handlePrevPage}
        onSearchChange={setSearchStr}
      />
    </div>
  );
};

export default Dashboard;
