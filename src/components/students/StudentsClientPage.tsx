
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Student } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Download,
  PlusCircle,
  Trash2,
  FilePenLine,
  Users,
} from "lucide-react";
import * as XLSX from "xlsx";
import { useToast } from "@/hooks/use-toast";
import { deleteAllStudents, deleteStudent } from "@/lib/actions";

export function StudentsClientPage({ students }: { students: Student[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(students);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "students.xlsx");
    toast({ title: "Success", description: "Students data downloaded." });
  };

  const handleDelete = async (id: number) => {
    const result = await deleteStudent(id);
    if (result?.success) {
      toast({ title: "Success", description: "Student deleted successfully." });
      router.refresh();
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result?.message || "Failed to delete student.",
      });
    }
  };
  
  const handleDeleteAll = async () => {
    setIsDeletingAll(true);
    const result = await deleteAllStudents();
    if (result?.success) {
      toast({ title: "Success", description: "All students deleted." });
    } else {
       toast({
        variant: "destructive",
        title: "Error",
        description: result?.message || "Failed to delete all students.",
      });
    }
    setIsDeletingAll(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Students List</h2>
          <p className="text-muted-foreground">
            A list of all students in the system.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/students/add">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Student
            </Button>
          </Link>
          <Button variant="outline" onClick={handleDownload} disabled={students.length === 0}>
            <Download className="mr-2 h-4 w-4" /> Download Excel
          </Button>
           <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={students.length === 0 || isDeletingAll}>
                <Trash2 className="mr-2 h-4 w-4" /> {isDeletingAll ? 'Deleting...' : 'Delete All'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all students from the database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAll}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Age</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length > 0 ? (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.age}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/students/edit/${student.id}`}>
                        <FilePenLine className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete {student.name}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(student.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Users className="h-8 w-8 text-muted-foreground"/>
                    <p className="text-muted-foreground">No students found.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
