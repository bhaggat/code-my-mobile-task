import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CopyIcon, ExternalLinkIcon, EyeIcon, PencilIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetFormsQuery } from "@/store/formApi";
import { CreateForm } from "@/components/create-form/CreateForm";
import Loader from "@/components/loader/Loader";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function Forms() {
  const { toast } = useToast();
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [editForm, setEditForm] = React.useState(null);

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

  const { data, isLoading, isError, isFetching } = useGetFormsQuery(
    {
      search: debouncedSearch,
      page,
      limit: 10,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const totalPages = React.useMemo(
    () =>
      Math.ceil(
        (data?.pagination?.total || 0) / (data?.pagination?.limit || 10)
      ),
    [data?.pagination?.total, data?.pagination?.limit]
  );

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleCloseForm = React.useCallback(() => {
    setEditForm(null);
  }, []);

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Title",
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
          const createdAt = new Date(row.original.createdAt);
          return createdAt.toLocaleString();
        },
      },
      {
        accessorKey: "published",
        header: "Published",
        cell: ({ row }) => (
          <div className="capitalize">
            {row.original.published === true ? "Yes" : "No"}
          </div>
        ),
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const publicId = row.original.publicId;
          const formUrl = `${location.origin}/public/forms/${publicId}`;
          const handleCopy = () => {
            navigator.clipboard.writeText(formUrl).then(() => {
              toast({
                title: "Copied to clipboard",
              });
            });
          };

          return (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <CopyIcon className="h-4 w-4" />
              </Button>
              <a href={formUrl} target="_blank">
                <Button variant="primary" size="sm">
                  <ExternalLinkIcon className="h-4 w-4" />
                </Button>
              </a>
              <Link to={`/forms/${row.original.id}`}>
                <Button variant="outline" size="sm">
                  <EyeIcon className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditForm(row.original)}
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: data?.data || [],
    columns,
    pageCount: Math.ceil((data?.total || 0) / 10),
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: 10,
      },
    },
    onPaginationChange: setPage,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold">Forms</h1>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search by title..."
          value={search}
          onChange={handleSearchChange}
          className="max-w-sm"
        />
        <CreateForm editForm={editForm} onClose={handleCloseForm} />
      </div>
      <div className="rounded-md border relative">
        {isFetching && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <Loader />
          </div>
        )}
        {isError ? (
          <div className="h-24 text-center text-red-500 flex items-center justify-center">
            Failed to load forms
          </div>
        ) : (
          !isLoading && (
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column?.columnDef?.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
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
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )
        )}
        {!isLoading && !isError && data?.data?.length > 0 && (
          <div className="border-t px-4 py-2 flex justify-end">
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
      </div>
    </div>
  );
}
