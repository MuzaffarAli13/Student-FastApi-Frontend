
import { Student } from "./definitions";
import { unstable_noStore as noStore } from 'next/cache';
import { cookies } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export function getAuthToken() {
    const cookieStore = cookies();
    return cookieStore.get('token')?.value;
}

export function setAuthToken(token: string) {
    const cookieStore = cookies();
    cookieStore.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
    });
}

export function deleteAuthToken() {
    const cookieStore = cookies();
    cookieStore.delete('token');
}

export async function getStudents(token?: string | null): Promise<Student[]> {
  noStore();
  try {
    const authToken = token || getAuthToken();
    if (!authToken) return [];
    
    const res = await fetch(`${API_URL}/students`, {
      cache: 'no-store',
      headers: {
          "Authorization": `Bearer ${authToken}`
      }
    });

    if (res.status === 401) {
        // This might be handled differently on the client
        if (typeof window === 'undefined') {
            deleteAuthToken();
        }
        return [];
    }

    if (!res.ok) {
      throw new Error("Failed to fetch students");
    }
    return res.json();
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
}

export async function getStudentById(id: string): Promise<Student | null> {
  noStore();
  try {
    const token = getAuthToken();
    if (!token) return null;

    const res = await fetch(`${API_URL}/students/${id}`, {
      cache: 'no-store',
      headers: {
          "Authorization": `Bearer ${token}`
      }
    });
    
    if (res.status === 401) {
        deleteAuthToken();
        return null;
    }

    if (!res.ok) {
      return null;
    }
    return res.json();
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
}
