"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ForecastItem } from "@/types/aiForecast";
import { format } from "date-fns";

interface Props {
    forecasts: ForecastItem[];
}

export default function ForecastTable({ forecasts }: Props) {
    const getConfidenceBadge = (confidence: string) => {
        switch (confidence) {
            case 'High': return <Badge className="bg-green-100 text-green-800">High</Badge>;
            case 'Medium': return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
            case 'Low': return <Badge className="bg-red-100 text-red-800">Low</Badge>;
            default: return <Badge>{confidence}</Badge>;
        }
    };

    const getStockStatus = (stock: number, predicted: number) => {
        if (stock === 0) return <Badge variant="destructive">Out of Stock</Badge>;
        if (stock < predicted * 0.3) return <Badge variant="destructive">Critical</Badge>;
        if (stock < predicted * 0.7) return <Badge className="bg-yellow-100 text-yellow-800">Low</Badge>;
        return <Badge className="bg-green-100 text-green-800">Adequate</Badge>;
    };

    return (
        <div className="rounded-xl border shadow-sm overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Medicine</TableHead>
                        <TableHead>Batch No</TableHead>
                        <TableHead>Predicted Sales (30d)</TableHead>
                        <TableHead>Current Stock</TableHead>
                        <TableHead>Stock Status</TableHead>
                        <TableHead>Expiry Date</TableHead>
                        <TableHead>Confidence</TableHead>
                        <TableHead>Recommendation</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {forecasts.map((item) => (
                        <TableRow key={`${item.medicine_id}-${item.batch_no}`}>
                            <TableCell className="font-medium">{item.medicine_name}</TableCell>
                            <TableCell>{item.batch_no}</TableCell>
                            <TableCell>{item.predicted_sales_next_30_days}</TableCell>
                            <TableCell>{item.current_stock}</TableCell>
                            <TableCell>{getStockStatus(item.current_stock, item.predicted_sales_next_30_days)}</TableCell>
                            <TableCell>{format(new Date(item.expiry_date), "PPP")}</TableCell>
                            <TableCell>{getConfidenceBadge(item.confidence)}</TableCell>
                            <TableCell className="max-w-xs text-sm">{item.reorder_recommendation}</TableCell>
                        </TableRow>
                    ))}
                    {forecasts.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center text-muted-foreground py-6">
                                No forecast data found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}