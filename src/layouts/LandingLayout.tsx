
import { Outlet } from "react-router-dom";
import LandingNavbar from "@/components/LandingNavbar";
import { ThemeProvider } from "@/components/theme-provider";

const LandingLayout = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="proflo-theme">
      <div className="flex min-h-screen flex-col">
        <div className="relative">
          {/* Hero Background that extends behind navbar */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/30%),transparent_30%),radial-gradient(circle_at_70%_60%,hsl(var(--secondary)/20%),transparent_30%)]"></div>
            <div className="absolute inset-y-0 right-0 w-[40%] bg-gradient-to-l from-primary/10 to-transparent"></div>
            <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float opacity-80"></div>
            <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-brand-blue/20 rounded-full blur-3xl animate-float-delay opacity-80"></div>
            <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          </div>

          {/* Navbar with backdrop blur */}
          <div className="fixed top-4 left-0 right-0 z-50 mx-auto w-full max-w-7xl px-4">
            <LandingNavbar />
          </div>
        </div>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default LandingLayout;
