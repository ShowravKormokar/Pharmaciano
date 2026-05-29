"use client";

import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Eye, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useJournalStore } from "@/store/journal.store";
import { JournalItem } from "@/types/journal";

interface Props {
    journal: JournalItem;
}

export default function JournalActions({ journal }: Props) {
    const router = useRouter();
    const { reverseJournal } = useJournalStore();

    const handleReverse = async () => {
        await reverseJournal(journal._id);
    };

    return (
        <div className="flex justify-end gap-2">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/dashboard/accounting/journal/view/${journal._id}`)}
                title="View"
                className="border-[0.1rem] rounded-md"
            >
                <Eye className="h-4 w-4" />
            </Button>
            {!journal.isReversed && (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" title="Reverse" className="border-[0.1rem] rounded-md text-orange-600">
                            <RotateCcw className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Reverse Journal Entry?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will create a reverse entry. This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleReverse}>Confirm Reverse</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
}