import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import Dashboard from "~/components/dashboard";
import { LoadingPage } from "~/components/loading";
import TaskTable from "~/components/task-table";
import { Button } from "~/components/ui/button";
import { cn, todoToTask } from "~/lib/utils";

import { api } from "~/utils/api";

export default function Home() {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });

  const { user, isLoaded: isUserLoaded, isSignedIn } = useUser();

  // const {
  //   fetchNextPage,
  //   fetchPreviousPage,
  //   hasNextPage,
  //   hasPreviousPage,
  //   isFetchingNextPage,
  //   isFetchingPreviousPage,
  //   isLoading,
  //   isError,
  //   data,
  // } = api.tasks.getTasksForUser.useInfiniteQuery({});
  // const dd = data?.pages[0];

  // useEffect(() => {
  //   void ctx.tasks.getTasksForUser.invalidate();
  // }, [pageSize]);

  // useEffect(() => {
  //   setLastCursor(currentCursor);
  //   setCurrentCursor(data?.nextCursor);
  // }, [data?.nextCursor]);

  // const { todos, cursor } = data;

  const renderUserView = () => {
    return isSignedIn ? (
      <Dashboard
        username={user.username ?? ""}
        imageUrl={user.imageUrl ?? ""}
      />
    ) : (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-5 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          TODO <span className="text-[hsl(280,100%,70%)]">Next</span>
        </h1>
        {/* <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          T<span className="text-[hsl(280,100%,70%)]">N</span>
        </h1> */}
        <p className="text-center text-white">
          A todo and task tracking app built in T3 stack
          <br />
          Sign up using your google or github account today
        </p>
        <div className="">
          <Button asChild className="bg-[hsl(280,100%,70%)] text-white">
            <SignInButton />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>TODO Next</title>
        <meta name="description" content="A Todo App created using T3 Stack" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={cn(
          "flex min-h-screen flex-col items-center gap-12 bg-gradient-to-b from-[#2e026d] to-[#15162c]",
          isSignedIn ? "items-start" : "",
        )}
      >
        {isUserLoaded ? renderUserView() : <LoadingPage />}
      </main>
    </>
  );
}
