import { NavLink } from "react-router-dom";

export const DashboardFooter = () => {
  return (
    <footer className="[grid-area:footer] bg-[#080b1a] border-t border-indigo-500/[0.12] px-6 py-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <h3 className="font-extrabold text-lg mb-2 tracking-wide bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            TaskFlow
          </h3>
          <p className="text-white/45 text-sm leading-relaxed">
            Organize smarter, achieve more. Your personal task and productivity hub.
          </p>
        </div>

        <div>
          <h4 className="text-white/60 font-bold text-xs uppercase tracking-widest mb-3">Quick Links</h4>
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
                  className="text-white/45 hover:text-indigo-400 text-sm no-underline transition-colors duration-200"
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h4 className="text-white/60 font-bold text-xs uppercase tracking-widest mb-3">Account</h4>
            <ul className="flex flex-col gap-2">
              {[
                { to: "/dashboard/profile", label: "Profile" },
                { to: "/dashboard/feedback", label: "Feedback" },
                { to: "/notifications", label: "Notifications" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className="text-white/45 hover:text-indigo-400 text-sm no-underline transition-colors duration-200"
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-8 pt-5 border-t border-indigo-500/[0.08] text-center">
        <p className="text-white/25 text-xs">
          &copy; {new Date().getFullYear()} TaskFlow. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
