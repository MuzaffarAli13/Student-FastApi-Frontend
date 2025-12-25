
import { getStudents } from "@/lib/api";
import { Suspense } from "react";
import { StudentsClientPage } from "@/components/students/StudentsClientPage";
import { TableSkeleton } from "@/components/students/TableSkeleton";

export const metadata = {
  title: "Students | StudentVerse",
};

async function StudentsList() {
    const students = await getStudents();
    return <StudentsClientPage students={students} />;
}

export default function StudentsPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <StudentsList />
    </Suspense>
  );
}
