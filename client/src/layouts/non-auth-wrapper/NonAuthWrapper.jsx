import { Outlet } from "react-router-dom";

export default function NonAuthWrapper() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
