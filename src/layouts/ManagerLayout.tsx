import { Outlet } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

const ManagerLayout = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-20">
      {/* Decorative blobs */}
      <div className="absolute top-[-120px] right-[-80px] w-[300px] h-[300px] rounded-full opacity-15 blur-3xl bg-primary" />
      <div className="absolute bottom-[-100px] left-[-60px] w-[280px] h-[280px] rounded-full opacity-10 blur-3xl bg-accent" />

      <Outlet />

      <BottomNav variant="manager" />
    </div>
  );
};

export default ManagerLayout;
