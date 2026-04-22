import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Sparkles } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="rounded-lg bg-gradient-to-br from-zinc-900 to-zinc-700 p-4 flex items-center justify-center dark:from-zinc-100 dark:to-zinc-300">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-zinc-900 to-zinc-700 blur-lg opacity-30 animate-pulse dark:from-zinc-100 dark:to-zinc-300" />
        </div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-4">This route doesn’t exist.</p>
        <a href="/" className="text-primary hover:opacity-80 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
