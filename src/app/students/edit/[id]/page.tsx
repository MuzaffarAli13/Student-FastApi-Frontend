
'use client'

import { StudentForm } from "@/components/students/StudentForm";
import { updateStudent } from "@/lib/actions";
import { getStudentById } from "@/lib/api";
import { notFound, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Student } from "@/lib/definitions";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditStudentPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const { token } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    if (token) {
      getStudentById(id, token).then(data => {
        if (!data) {
          notFound();
        } else {
          setStudent(data);
        }
        setLoading(false);
      });
    } else {
      router.push('/login');
    }
  }, [id, token, router]);


  if (loading) {
      return (
          <div className="max-w-2xl mx-auto space-y-4">
              <Skeleton className="h-10 w-40" />
              <div className="space-y-6">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
          </div>
      )
  }

  if (!student) {
    return notFound();
  }
  
  const updateStudentWithId = updateStudent.bind(null, student.id);

  return (
    <StudentForm student={student} action={updateStudentWithId} />
  );
}
