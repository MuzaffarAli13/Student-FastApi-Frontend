
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Age</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-5 w-10" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-48" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-12" />
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
