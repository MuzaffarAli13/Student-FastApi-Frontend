
'use client';
import { getStudents } from "@/lib/api";
import { Suspense, useEffect, useState } from "react";
import { StudentsClientPage } from "@/components/students/StudentsClientPage";
import { TableSkeleton } from "@/components/students/TableSkeleton";
import { useAuth } from "@/context/AuthContext";
import { Student } from "@/lib/definitions";

export default function StudentsPage() {
    const { token } = useAuth();
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStudents() {
            if (token) {
                setLoading(true);
                const data = await getStudents(token);
                setStudents(data);
                setLoading(false);
            }
        }
        fetchStudents();
    }, [token]);

    if (loading) {
        return <TableSkeleton />;
    }

    return <StudentsClientPage students={students} />;
}
