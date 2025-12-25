
import { StudentForm } from "@/components/students/StudentForm";
import { createStudent } from "@/lib/actions";

export const metadata = {
    title: "Add Student | StudentVerse",
};

export default function AddStudentPage() {
  return (
    <StudentForm action={createStudent} />
  );
}
