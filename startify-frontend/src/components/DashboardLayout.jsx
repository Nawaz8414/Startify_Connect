import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "./common.css";

export default function DashboardLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">{children}</main>
      </div>
    </>
  );
}
