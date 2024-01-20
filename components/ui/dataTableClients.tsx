"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown } from "lucide-react"

import { Button } from "./button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "./dropdown-menu"
import { Input } from "./input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./table"
import {Device} from "../../api/device/deviceTypes";
import {useQuery} from "react-query";
import {getProjects} from "../../api/project/projectCalls";
import {Project} from "../../api/project/projectTypes";
import {useParams} from "next/navigation";
import {getDevices} from "../../api/device/deviceCalls";

export const columns: ColumnDef<Device>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => {
            return (
                <div className={`flex justify-center`}>
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        DeviceId
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => <div className="flex justify-center">{row.getValue("id")}</div>
    },
    {
        accessorKey: "modelId",
        header: ({ column }) => {
            return (
                <div className={`flex justify-center`}>
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Model Version
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => <div className="flex justify-center">{row.getValue("modelId")}</div>
    },
    {
        accessorKey: "needsUpdate",
        header: ({ column }) => {
            return (
                <div className={`flex justify-center`}>
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Newest Version
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => <div className="flex justify-center">{row.getValue("needsUpdate") + ""}</div>
    },
    {
        accessorKey: "last_online",
        header: ({ column }) => {
            return (
                <div className={`flex justify-center`}>
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Last seen
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => {
            const online:boolean = row.getValue("online")
            if (online){
                return <div className="flex justify-center">Now</div>
            }

            const date = new Date(row.getValue("last_online"))

            let day = date.getDate().toString().padStart(2, '0');
            let month = (date.getMonth() + 1).toString().padStart(2, '0'); // +1 because months are 0-indexed
            let year = "20" + date.getFullYear().toString().slice(-2); // Get last two digits of year
            let hours = date.getHours().toString().padStart(2, '0');
            let minutes = date.getMinutes().toString().padStart(2, '0');

            return <div className="flex justify-center">{day}-{month}-{year} {hours}:{minutes}</div>
        }
    },
    {
        accessorKey: "online",
        header: ({ column }) => {
            return (
                <div className={`flex justify-center`}>
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className={"text-center"}
                    >
                        Online
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => {
            const online:boolean = row.getValue("online");
            return <div className={`flex justify-center`}>
                <div className={`${online? "blob-active" : "blob-inactive"}`}/>
            </div>
        }
    },
]


export function DataTableClients() {
    let params = useParams();
    let projectId = params.projectId as string;


    const { data: projects_data, status: projects_status } = useQuery({"queryKey": 'projects', "queryFn": getProjects });
    let currentModelId:string | null = null;
    if (projects_status === "success"){
        let current_project:Project = projects_data.filter((project:Project)=> project.id === projectId)[0]
        console.log(current_project)
        currentModelId = current_project.current_modelId;
    }

    const { data: product_data, status: product_status } = useQuery({"queryKey": ['product', projectId], "queryFn": getDevices, refetchInterval: 5000});

    let data = React.useMemo(() => {
        if (!product_data) return
        let data:Device[] = product_data

        data = data.map((obj)=>{
            obj.needsUpdate = (obj.modelId === currentModelId)
            return obj
        })
        return data
    }, [product_data, currentModelId]);


    const [sorting, setSorting] = React.useState<SortingState>([{id:"online", desc: true}])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    if (!data) {
        data = []
    }
    let table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        initialState: {
          pagination: {
              pageSize: 15,
          }
        },
        autoResetAll: false,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        defaultColumn: {
            size: 200, //starting column size
            minSize: 50, //enforced during column resizing
            maxSize: 500, //enforced during column resizing
        },
    })
    if (product_status !== "success") return <div/>

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter ids..."
                    value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        table.getColumn("id")?.setFilterValue(event.target.value)
                    }}
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value: any) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} style={{ width: header.column.getSize() }}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} style={{ width: cell.column.getSize()}}
                                            >
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
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {table.previousPage()}}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {table.nextPage()}}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
