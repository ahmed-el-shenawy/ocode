import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <div>
        <Sidebar />
        <main>{children}</main>
      </div>
    </div>
  );
}
