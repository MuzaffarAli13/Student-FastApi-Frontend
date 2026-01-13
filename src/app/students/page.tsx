
'use client';
import { getStudents } from "@/lib/api";
import { useEffect, useState } from "react";
import { StudentsClientPage } from "@/components/students/StudentsClientPage";
import { TableSkeleton } from "@/components/students/TableSkeleton";
import { useAuth } from "@/context/AuthContext";
import { Student } from "@/lib/definitions";
import { useRouter } from "next/navigation";

export default function StudentsPage() {
    const { token, logout } = useAuth();
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchStudents() {
            if (token) {
                setLoading(true);
                try {
                    const data = await getStudents(token);
                    setStudents(data);
                } catch (error) {
                    console.error("Failed to fetch students, logging out.", error);
                    logout();
                    router.push('/login');
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        }
        fetchStudents();
    }, [token, logout, router]);

    if (loading) {
        return <TableSkeleton />;
    }

    return <StudentsClientPage students={students} />;
}
