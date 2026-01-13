
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getStudents } from "./api";
import { cookies } from "next/headers";

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
    [key: string]: string[] | undefined;
  };
  message?: string | null;
  success?: boolean;
  token?: string | null;
};

const AuthSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
});

function getApiAuthToken() {
    const cookieStore = cookies();
    return cookieStore.get('token')?.value;
}


export async function signup(prevState: State, formData: FormData) {
    const validatedFields = AuthSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid fields.',
        };
    }

    try {
        const res = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validatedFields.data),
        });
        
        if (!res.ok) {
            const errorData = await res.json();
            return { message: errorData.detail || 'Failed to sign up.' };
        }
        
    } catch (error) {
        return { message: 'Network Error: Failed to sign up.' };
    }
    
    redirect('/login?message=Signup successful! Please log in.');
}

export async function login(prevState: State, formData: FormData) {
    const validatedFields = AuthSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid fields.',
        };
    }

    try {
        const body = new URLSearchParams();
        body.append('username', validatedFields.data.username);
        body.append('password', validatedFields.data.password);

        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString(),
        });
        
        if (!res.ok) {
            const errorData = await res.json();
            return { message: errorData.detail || 'Failed to login.', success: false };
        }
        
        const data = await res.json();
        return { success: true, token: data.access_token };
        
    } catch (error) {
        return { message: 'Network Error: Failed to login.', success: false };
    }
}

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
    const token = getApiAuthToken();
    if (!token) return { message: "Authentication error." };
    const res = await fetch(`${API_URL}/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
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
    const token = getApiAuthToken();
    if (!token) return { message: "Authentication error." };
    const res = await fetch(`${API_URL}/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
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
    const token = getApiAuthToken();
    if (!token) return { message: "Authentication error." };
    const res = await fetch(`${API_URL}/students/${id}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });
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
    const token = getApiAuthToken();
    if (!token) return { message: "Authentication error." };
    const students = await getStudents(token);
    if (students && students.length > 0) {
      await Promise.all(
        students.map((student) =>
          fetch(`${API_URL}/students/${student.id}`, { 
              method: "DELETE",
              headers: { "Authorization": `Bearer ${token}` }
          })
        )
      );
    }
    revalidatePath("/students");
    return { success: true, message: "All students deleted." };
  } catch (error) {
    return { message: "Database Error: Failed to Delete All Students." };
  }
}
