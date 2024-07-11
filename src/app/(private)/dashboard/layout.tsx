import Sidebar from "@/components/sidebar";
import SecondaryNavbar from "@/components/secondary-navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SecondaryNavbar />
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </>
  );
}
