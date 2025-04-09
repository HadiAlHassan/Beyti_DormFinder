// app/student/home/page.tsx
export default function StudentHomePage() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold text-primary">
        Welcome back, Sailor! 🛏️
      </h1>
      <p className="mt-4 text-muted-foreground text-lg">
        Ready to find your perfect dorm or roommate? Head over to{" "}
        <strong>Explore Dorms</strong> or <strong>Find a Roommate</strong> from
        the sidebar!
      </p>
    </div>
  );
}