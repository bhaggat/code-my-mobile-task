import * as React from "react";
import { useParams } from "react-router-dom";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronDown } from "lucide-react";
import Loader from "@/components/loader/Loader";
import { useGetFormSubmissionsQuery } from "@/store/formApi";

export default function FormSubmissions() {
  const { id } = useParams();
  const { data, isLoading, isError, isFetching } =
    useGetFormSubmissionsQuery(id);

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => <div className="w-[50px]">{row.original.id}</div>,
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <div className="w-[300px] truncate">{row.original.email}</div>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Submitted At",
        cell: ({ row }) => (
          <div className="w-[200px] whitespace-nowrap">
            {new Date(row.original.createdAt).toLocaleString()}
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: data?.data?.form?.submits || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const fieldsObjMap = React.useMemo(() => {
    if (data?.data?.form?.fields) {
      return data.data.form.fields.reduce((acc, field) => {
        acc[`${field.id}`] = { ...field };
        return acc;
      }, {});
    }
    return {};
  }, [data?.data?.form?.fields]);
  console.log("fieldsObjMap", fieldsObjMap);
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">{data?.data?.form?.title}</h1>
      <div className="rounded-md border relative">
        {isFetching && (
          <div className="absolute justify-center align-center p-6 flex w-full">
            <Loader />
          </div>
        )}
        {isError ? (
          <div className="h-24 text-center text-red-500">
            Failed to load submissions
          </div>
        ) : (
          !isLoading && (
            <div className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((column) => (
                      <TableHead key={column.accessorKey}>
                        {column.header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
              </Table>
              <Accordion type="single" collapsible className="w-full">
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <AccordionItem
                      key={row.original.id}
                      value={row.original.id.toString()}
                    >
                      <AccordionTrigger className="hover:no-underline w-full py-0">
                        <div className="flex w-full">
                          <Table>
                            <TableBody>
                              <TableRow className="hover:bg-transparent border-0">
                                {row.getVisibleCells().map((cell) => (
                                  <TableCell key={cell.id} className="py-3">
                                    {flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext()
                                    )}
                                  </TableCell>
                                ))}
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="px-4 py-3 bg-slate-50 border-t">
                          <div className="grid grid-cols-2 gap-4">
                            {Object.entries(
                              JSON.parse(row.original.submittedData)
                            ).map(([key, item]) => {
                              return (
                                <div
                                  key={key}
                                  className="flex flex-col p-2 bg-white rounded-md"
                                >
                                  <span className="text-sm font-medium text-gray-500 mb-1">
                                    {`${fieldsObjMap[key].name} (${fieldsObjMap[key].fieldType})`}
                                  </span>
                                  <span className="text-sm">{item}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))
                ) : (
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-24 text-center"
                        >
                          No submissions yet.
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                )}
              </Accordion>
            </div>
          )
        )}
      </div>
    </div>
  );
}
