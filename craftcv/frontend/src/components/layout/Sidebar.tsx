import Link from "next/link";

export function Sidebar() {
  return (
    <aside>
      <ul>
        <li><Link href="/dashboard">Dashboard</Link></li>
        <li><Link href="/dashboard/templates">Templates</Link></li>
        <li><Link href="/dashboard/settings">Settings</Link></li>
      </ul>
    </aside>
  );
}
