import { NavLink } from "react-router-dom";

export const DashboardFooter = () => {
  return (
    <footer className="[grid-area:footer] bg-[#07110d] border-t border-[rgba(0,255,140,0.12)] px-6 py-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <h3 className="text-[#00e676] font-extrabold text-lg mb-2 tracking-wide">TaskFlow</h3>
          <p className="text-white/55 text-sm leading-relaxed">
            Organize smarter, achieve more. Your personal task and productivity hub.
          </p>
        </div>

        <div>
          <h4 className="text-[#dffff0] font-bold text-sm uppercase tracking-widest mb-3">Quick Links</h4>
          <ul className="flex flex-col gap-2">
            {[
              { to: "/dashboard", label: "Dashboard" },
              { to: "/analysis", label: "Analysis" },
              { to: "/projects", label: "Projects" },
              { to: "/friendsdashboard", label: "Friends" },
            ].map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className="text-white/55 hover:text-[#00e676] text-sm no-underline transition-colors duration-200"
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h4 className="text-[#dffff0] font-bold text-sm uppercase tracking-widest mb-3">Account</h4>
            <ul className="flex flex-col gap-2">
              {[
                { to: "/dashboard/profile", label: "Profile" },
                { to: "/dashboard/feedback", label: "Feedback" },
                { to: "/notifications", label: "Notifications" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className="text-white/55 hover:text-[#00e676] text-sm no-underline transition-colors duration-200"
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-8 pt-5 border-t border-[rgba(0,255,140,0.08)] text-center">
        <p className="text-white/35 text-xs">
          &copy; {new Date().getFullYear()} TaskFlow. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
