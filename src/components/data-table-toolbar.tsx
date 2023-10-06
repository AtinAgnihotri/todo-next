import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { DataTableViewOptions } from "./data-table-view-options";

import { priorities, statuses } from "~/lib/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import CreateNew from "./create-new";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onNewClick: () => void;
  onSearchChange: (val: string) => void;
}

export function DataTableToolbar<TData>({
  table,
  onNewClick,
  onSearchChange,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between text-white">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.getColumn("title")?.setFilterValue(event.target.value);
            onSearchChange(event.target.value);
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={priorities}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
        <DataTableViewOptions table={table} />
        {/* <Button
          variant="default"
          onClick={onNewClick}
          className="h-8 border border-white bg-transparent px-2 hover:bg-white hover:text-black lg:px-3"
        >
          Add New
        </Button> */}
      </div>
      <CreateNew />
    </div>
  );
}
