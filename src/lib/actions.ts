
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getStudents } from "./api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const StudentSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  age: z.coerce
    .number()
    .int()
    .positive({ message: "Age must be a positive number." }),
});

export type State = {
  errors?: {
    name?: string[];
    email?: string[];
    age?: string[];
  };
  message?: string | null;
};

export async function createStudent(prevState: State, formData: FormData) {
  const validatedFields = StudentSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    age: formData.get("age"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to create student. Please check the fields.",
    };
  }
  
  try {
    const res = await fetch(`${API_URL}/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedFields.data),
    });

    if (!res.ok) {
      return { message: "Database Error: Failed to Create Student." };
    }
  } catch (error) {
    return { message: "Database Error: Failed to Create Student." };
  }

  revalidatePath("/students");
  redirect("/students");
}

export async function updateStudent(id: number, prevState: State, formData: FormData) {
  const validatedFields = StudentSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    age: formData.get("age"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to update student. Please check the fields.",
    };
  }

  try {
    const res = await fetch(`${API_URL}/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({id, ...validatedFields.data}),
    });

    if (!res.ok) {
        return { message: 'Database Error: Failed to Update Student.' };
    }
  } catch (error) {
    return { message: "Database Error: Failed to Update Student." };
  }

  revalidatePath("/students");
  redirect("/students");
}

export async function deleteStudent(id: number) {
  try {
    const res = await fetch(`${API_URL}/students/${id}`, { method: "DELETE" });
    if (!res.ok) {
        return { message: 'Database Error: Failed to Delete Student.' };
    }
    revalidatePath("/students");
    return { success: true, message: "Student deleted." };
  } catch (error) {
    return { message: "Database Error: Failed to Delete Student." };
  }
}

export async function deleteAllStudents() {
  try {
    const students = await getStudents();
    if (students && students.length > 0) {
      await Promise.all(
        students.map((student) =>
          fetch(`${API_URL}/students/${student.id}`, { method: "DELETE" })
        )
      );
    }
    revalidatePath("/students");
    return { success: true, message: "All students deleted." };
  } catch (error) {
    return { message: "Database Error: Failed to Delete All Students." };
  }
}
