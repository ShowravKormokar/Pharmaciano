"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface Column {
    key: string;
    label: string;
    render?: (value: any) => React.ReactNode;
}

interface Props {
    data: any[];
    columns: Column[];
}

export default function ReportTable({ data, columns }: Props) {
    return (
        <div className="rounded-xl border shadow-sm overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map(col => (
                            <TableHead key={col.key}>{col.label}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length > 0 ? (
                        data.map((row, idx) => (
                            <TableRow key={idx}>
                                {columns.map(col => (
                                    <TableCell key={col.key}>
                                        {col.render ? col.render(row[col.key]) : row[col.key]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="text-center text-muted-foreground py-6">
                                No data available for the selected period.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}