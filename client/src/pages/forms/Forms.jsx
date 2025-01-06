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

export default function Forms() {
  const { toast } = useToast();
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [editForm, setEditForm] = React.useState(null);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 800);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const { data, isLoading, isError, isFetching } = useGetFormsQuery({
    search: debouncedSearch,
  });

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
            {row.original.published ? "Yes" : "No"}
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
              <Button variant="primary" size="sm">
                <a href={formUrl} target="_blank">
                  <ExternalLinkIcon className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="sm">
                <Link to={`/forms/${row.original.id}`}>
                  <EyeIcon className="h-4 w-4" />
                </Link>
              </Button>
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
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold">Forms</h1>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search by title..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="max-w-sm"
        />
        <CreateForm editForm={editForm} onClose={() => setEditForm(null)} />
      </div>
      <div className="rounded-md border relative">
        {isFetching && (
          <div className="absolute justify-center align-center p-6 flex w-full">
            <Loader />
          </div>
        )}
        {isError ? (
          <div className="h-24 text-center text-red-500">
            Failed to load data
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
      </div>
    </div>
  );
}
