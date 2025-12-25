
"use client";

import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Student } from "@/lib/definitions";
import { State } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const StudentFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  age: z.coerce.number().int().positive('Age must be a positive number'),
});

type StudentFormData = z.infer<typeof StudentFormSchema>;

export function StudentForm({
  student,
  action,
}: {
  student?: Student;
  action: (state: State, formData: FormData) => Promise<State>;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [state, formAction] = useFormState(action, { message: null, errors: {} });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(StudentFormSchema),
    defaultValues: {
      name: student?.name || "",
      email: student?.email || "",
      age: student?.age || undefined,
    },
  });

  useEffect(() => {
    if (state.message && !state.errors) {
      toast({
        title: "Success",
        description: state.message,
      });
      router.push("/students");
    } else if (state.message && state.errors) {
       toast({
        variant: "destructive",
        title: "Error",
        description: state.message,
      });
    }
  }, [state, router, toast]);

  const formErrors = state.errors || errors;

  return (
    <div className="max-w-2xl mx-auto">
       <div className="mb-4">
        <Button variant="outline" size="sm" asChild>
            <Link href="/students">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Students
            </Link>
        </Button>
       </div>
      <form action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle>{student ? "Edit Student" : "Add New Student"}</CardTitle>
            <CardDescription>
              {student ? "Update the student's details below." : "Fill in the details to add a new student."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...register("name")}
                aria-invalid={!!formErrors.name}
              />
              {formErrors.name && (
                <p className="text-sm text-destructive">{formErrors.name[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                aria-invalid={!!formErrors.email}
              />
              {formErrors.email && (
                <p className="text-sm text-destructive">{formErrors.email[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                {...register("age")}
                aria-invalid={!!formErrors.age}
              />
              {formErrors.age && (
                <p className="text-sm text-destructive">{formErrors.age[0]}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">
              {student ? "Update Student" : "Create Student"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
