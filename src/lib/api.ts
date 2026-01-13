
import { Student } from "./definitions";
import { unstable_noStore as noStore } from 'next/cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function getStudents(token: string): Promise<Student[]> {
  noStore();
  try {
    const res = await fetch(`${API_URL}/students`, {
      cache: 'no-store',
      headers: {
          "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error('Failed to fetch students');
    }
    return res.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export async function getStudentById(id: string, token: string): Promise<Student | null> {
  noStore();
  try {
    if (!token) return null;

    const res = await fetch(`${API_URL}/students/${id}`, {
      cache: 'no-store',
      headers: {
          "Authorization": `Bearer ${token}`
      }
    });
    
    if (!res.ok) {
      return null;
    }
    return res.json();
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
}
