
import { StudentForm } from "@/components/students/StudentForm";
import { updateStudent } from "@/lib/actions";
import { getStudentById } from "@/lib/api";
import { notFound } from "next/navigation";

export const metadata = {
    title: "Edit Student | StudentVerse",
};

export default async function EditStudentPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const student = await getStudentById(id);

  if (!student) {
    notFound();
  }
  
  const updateStudentWithId = updateStudent.bind(null, student.id);

  return (
    <StudentForm student={student} action={updateStudentWithId} />
  );
}
