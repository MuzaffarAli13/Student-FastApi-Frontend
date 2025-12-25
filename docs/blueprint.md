# **App Name**: StudentVerse

## Core Features:

- Student Listing: Fetch and display a list of students from the FastAPI backend using the `GET /students` endpoint.
- Add New Student: Allow users to add new students to the database by submitting a form that calls the `POST /students` endpoint.
- View Student Details: Enable users to view detailed information for a single student by clicking on their entry, fetching data from the `GET /students/{id}` endpoint.
- Edit Student Details: Allow users to edit existing student information and update the database via the `PUT /students/{id}` endpoint.
- Delete Student: Implement functionality to delete a student from the database using the `DELETE /students/{id}` endpoint.
- Delete All Students: Implement functionality to delete all students. (Requires an aggregate of DELETE calls)
- Export to Excel: Provide an option to download all student data in Excel format. Data should be fetched via API call and converted to excel format using `xlsx` library.

## Style Guidelines:

- Primary color: Forest Green (#38A3A5) for a vibrant and natural feel, embodying growth and learning.
- Background color: Dark Green (#0B3C49) for a professional and accessible environment, which suggests trust.
- Accent color: Yellow-Green (#D0FC3D), as the hue that is slightly to the "left" of green on the color wheel, but set to a vibrant value so that it can draw the user's eye to details such as actionable UI.
- Body and headline font: 'Inter', a sans-serif font for a clean and modern look suitable for both headlines and body text.
- Use a consistent set of simple, line-based icons from a library like 'Lucide React' to maintain a clean and modern aesthetic.
- Implement a responsive grid layout using Tailwind CSS to ensure optimal viewing on different screen sizes.
- Use subtle fade-in and slide-in animations for page transitions and component mounting to provide a smooth user experience.