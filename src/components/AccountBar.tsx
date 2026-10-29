import { Link } from "react-router-dom";
import { hasAccess, useAuth } from "../auth/AuthProvider";

const BARK = "#4A3A2E";
const SAND = "#F3EFE4";

// Top bar: "← Home" on the left, sign-in status on the right
const AccountBar = () => {
  const { user, loading, logout } = useAuth();

  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <Link
        to="/"
        className="font-semibold underline-offset-2 hover:underline"
        style={{ color: BARK }}
      >
        ← Learn &amp; Help Animals
      </Link>

      {loading ? null : hasAccess(user) ? (
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="grid h-8 w-8 place-items-center rounded-full text-xs font-bold"
            style={{ backgroundColor: BARK, color: SAND }}
          >
            {user!.email?.charAt(0).toUpperCase()}
          </span>
          <span className="hidden text-xs sm:block" style={{ color: BARK }}>
            Signed in as <strong>{user!.email}</strong>
          </span>
          <button
            type="button"
            onClick={logout}
            className="rounded-full border px-3 py-1 text-xs font-semibold transition-colors hover:border-[#4A3A2E]"
            style={{ borderColor: "#d6d1c7", color: BARK }}
          >
            Sign out
          </button>
        </div>
      ) : (
        <Link
          to="/signin?next=/library"
          className="rounded-full px-4 py-1.5 text-xs font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: BARK, color: SAND }}
        >
          Sign in
        </Link>
      )}
    </div>
  );
};

export default AccountBar;
