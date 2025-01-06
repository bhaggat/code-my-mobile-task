import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { useGetFieldsQuery } from "@/store/fieldApi";
import { AddField } from "@/components/create-field/CreateField";
import Loader from "@/components/loader/Loader";

export const columns = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="w-[200px] truncate">{row.original.name}</div>
    ),
  },
  {
    accessorKey: "fieldType",
    header: "Field Type",
    cell: ({ row }) => (
      <div className="capitalize w-[150px]">{row.original.fieldType}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <div className="w-[200px] whitespace-nowrap">
        {new Date(row.original.createdAt).toLocaleString()}
      </div>
    ),
  },
];

export default function Fields() {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 800);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const { data, isLoading, isError, isFetching } = useGetFieldsQuery({
    search: debouncedSearch,
    page,
    limit: 10,
  });

  const totalPages = React.useMemo(
    () =>
      Math.ceil(
        (data?.pagination?.total || 0) / (data?.pagination?.limit || 10)
      ),
    [data?.pagination?.total, data?.pagination?.limit]
  );

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSearchChange = React.useCallback((event) => {
    setSearch(event.target.value);
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-none">
        <h1 className="text-2xl font-bold">Fields</h1>
        <div className="flex items-center justify-between py-4">
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={handleSearchChange}
            className="max-w-sm"
          />
          <AddField />
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="rounded-md border relative flex-1 flex flex-col">
          {isFetching && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
              <Loader />
            </div>
          )}
          {isError ? (
            <div className="h-24 text-center text-red-500 flex items-center justify-center">
              Failed to load fields
            </div>
          ) : (
            !isLoading && (
              <>
                <div className="flex-1 overflow-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                      <TableRow>
                        {columns.map((column) => (
                          <TableHead
                            key={column.accessorKey}
                            className="bg-white"
                          >
                            {column.header}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                          <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                            className="hover:bg-slate-50"
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id} className="py-3">
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={columns.length}
                            className="h-24 text-center text-muted-foreground"
                          >
                            No fields found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {data?.data?.length > 0 && (
                  <div className="flex-none border-t px-4 py-2 flex justify-end bg-white">
                    <Pagination>
                      <PaginationContent>
                        {page > 1 && (
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => setPage((p) => Math.max(1, p - 1))}
                              disabled={isFetching}
                            />
                          </PaginationItem>
                        )}

                        {totalPages > 0 && (
                          <PaginationItem>
                            <PaginationLink
                              onClick={() => setPage(1)}
                              isActive={page === 1}
                              disabled={isFetching}
                            >
                              1
                            </PaginationLink>
                          </PaginationItem>
                        )}

                        {page > 3 && <PaginationEllipsis />}

                        {page > 2 && (
                          <PaginationItem>
                            <PaginationLink
                              onClick={() => setPage(page - 1)}
                              disabled={isFetching}
                            >
                              {page - 1}
                            </PaginationLink>
                          </PaginationItem>
                        )}

                        {page > 1 && page < totalPages && (
                          <PaginationItem>
                            <PaginationLink isActive disabled={isFetching}>
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        )}

                        {page < totalPages - 1 && (
                          <PaginationItem>
                            <PaginationLink
                              onClick={() => setPage(page + 1)}
                              disabled={isFetching}
                            >
                              {page + 1}
                            </PaginationLink>
                          </PaginationItem>
                        )}

                        {page < totalPages - 2 && <PaginationEllipsis />}

                        {totalPages > 1 && (
                          <PaginationItem>
                            <PaginationLink
                              onClick={() => setPage(totalPages)}
                              isActive={page === totalPages}
                              disabled={isFetching}
                            >
                              {totalPages}
                            </PaginationLink>
                          </PaginationItem>
                        )}

                        {page < totalPages && (
                          <PaginationItem>
                            <PaginationNext
                              onClick={() =>
                                setPage((p) => Math.min(totalPages, p + 1))
                              }
                              disabled={isFetching}
                            />
                          </PaginationItem>
                        )}
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
}
