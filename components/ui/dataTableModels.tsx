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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

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
import {getModels} from "../../api/models/modelCalls";
import Link from "next/link";
import axiosClient from "../../lib/axios_client";


export function DataTableModels() {
    let params = useParams();
    let projectId = params.projectId as string;


    const { data: projects_data, status: projects_status } = useQuery({"queryKey": 'projects', "queryFn": getProjects});
    let currentModelId:string | null = null;
    if (projects_status === "success"){
        let current_project:Project = projects_data.filter((project:Project)=> project.id === projectId)[0]
    }

    let { data: models_data, status: models_status, refetch } = useQuery({"queryKey": ['models',projectId], "queryFn": getModels , refetchInterval: 5000});

    let data = React.useMemo(() => {
        return models_data
    }, [models_data]);

    const columns: ColumnDef<Device>[] = [
        {
            accessorKey: "id",
            header: ({ column }) => {
                return (
                    <div className={`flex justify-center`}>
                        MLFlowId
                    </div>
                )
            },
            cell: ({ row }) => {
                let params = useParams();
                let projectId = params.projectId as string;
                let modelId:string = row.getValue("id");
                return <Link href={`http://134.209.232.89:5000/#/experiments/${projectId}/runs/${modelId}`} className="flex justify-center underline">{modelId}</Link>
            }
        },
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <div className={`flex justify-center`}>
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Name
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => <div className="flex justify-center">{row.getValue("name")}</div>
        },
        {
            accessorKey: "mAP05",
            header: ({ column }) => {
                return (
                    <div className={`flex justify-center`}>
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            mAP_0.5
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )
            },
            sortingFn: (a, b) => {
                let mAP05_a = a.getValue("mAP05")
                if (typeof mAP05_a != "number"){
                    mAP05_a = 0
                }
                let mAP05_b = b.getValue("mAP05")
                if (typeof mAP05_b != "number"){
                    mAP05_b = 0
                }
                // @ts-ignore
                if (mAP05_a>mAP05_b) return -1
                // @ts-ignore
                if (mAP05_a<mAP05_b) return 1
                return 0
            },
            cell: ({ row }) => {
                let map05 = row.getValue("mAP05")
                let map05_pretty: number = 0
                if (typeof map05 === 'number'){
                    map05_pretty = Math.round(map05 * 100) / 100
                }
                return <div className="flex justify-center">{map05_pretty}</div>
            }
        },
        {
            accessorKey: "precision",
            header: ({ column }) => {
                return (
                    <div className={`flex justify-center`}>
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Precision
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )
            },
            sortingFn: (a, b) => {
                let precision_a = a.getValue("precision")
                if (typeof precision_a != "number") {
                    precision_a = 0
                }
                let precision_b = b.getValue("precision")
                if (typeof precision_b != "number"){
                    precision_b = 0
                }
                // @ts-ignore
                if (precision_a>precision_b) return -1
                // @ts-ignore
                if (precision_a<precision_b) return 1
                return 0
            },
            cell: ({ row }) => {
                let precision = row.getValue("precision")
                let precision_pretty: number = 0
                if (typeof precision === 'number'){
                    precision_pretty = Math.round(precision * 100) / 100
                }
                return <div className="flex justify-center">{precision_pretty}</div>
            }
        },
        {
            accessorKey: "recall",
            header: ({column}) => {
                return (
                    <div className={`flex justify-center`}>
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Recall
                            <ArrowUpDown className="ml-2 h-4 w-4"/>
                        </Button>
                    </div>
                )
            },
            sortingFn: (a, b) => {
                let recall_a = a.getValue("recall")
                if (typeof recall_a != "number") {
                    recall_a = 0
                }
                let recall_b = b.getValue("recall")
                if (typeof recall_b != "number") {
                    recall_b = 0
                }
                // @ts-ignore
                if (recall_a > recall_b) return -1
                // @ts-ignore
                if (recall_a < recall_b) return 1
                return 0
            },
            cell: ({row}) => {
                let recall = row.getValue("recall")
                let recall_pretty: number = 0
                if (typeof recall === 'number') {
                    recall_pretty = Math.round(recall * 100) / 100
                }
                return <div className="flex justify-center">{recall_pretty}</div>
            },
        },
        {
            accessorKey: "active",
            header: ({ column }) => {
                return (
                    <div className={`flex justify-center`}>
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Deploy
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )
            },
            sortingFn: (a, b) => {
                let active_a = a.getValue("active")
                if (typeof active_a != "boolean") {
                    active_a = false
                }
                let active_b = b.getValue("active")
                if (typeof active_b != "boolean"){
                    active_b = 0
                }
                // @ts-ignore
                if (active_a) return 1
                // @ts-ignore
                if (active_b) return -1
                return 0
            },
            cell: ({ row }) => {
                let active = row.getValue("active")
                let params = useParams();
                // @ts-ignore
                return <div className="flex justify-center">
                    {active ? "active" : <Button
                        onClick={async function() {
                            let projectId = params.projectId as string;
                            let modelId:string = row.getValue("id")
                            await axiosClient.post(`${projectId}/setModel`,{
                                modelId: modelId
                            })
                            refetch()

                        }}
                        className={"bg-blue-700 hover:bg-blue-900"}>
                        deploy
                    </Button>}
                </div>
            }
        }
    ]

    const [sorting, setSorting] = React.useState<SortingState>([{id:"active", desc: true}])
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
    if (models_status !== "success") return <div/>

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter names..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        table.getColumn("name")?.setFilterValue(event.target.value)
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
