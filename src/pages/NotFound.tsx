import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="border border-border bg-card px-8 py-10 text-center">
        <h1 className="mb-4 text-4xl font-bold text-foreground font-heading tracking-tight">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">This page could not be found.</p>
        <Link to="/" className="text-foreground underline underline-offset-4 hover:text-primary font-medium">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;