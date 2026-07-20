import type { ReactNode } from "react";
import Sidebar from "@/components/navigation/Sidebar";
import Providers from "@/providers/Providers";

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <div className="min-h-screen flex">
        {/* Permanent left glass sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 md:pl-72 min-h-screen relative z-10 w-full flex flex-col">
          {children}
        </div>
      </div>
    </Providers>
  );
}
