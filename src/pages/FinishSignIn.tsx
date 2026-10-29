import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { completeLibraryLink, goTo, isLibraryLink } from "../auth/signIn";

const COLORS = { sand: "#F3EFE4", bark: "#4A3A2E", sage: "#9AA77C" };

type State = "working" | "ask-email" | "invalid" | "error";

// The page the email link opens: /finish-signin
const FinishSignIn = () => {
  const [state, setState] = useState<State>("working");
  const [email, setEmail] = useState("");
  const started = useRef(false);

  const finish = async (emailFromPrompt?: string) => {
    setState("working");
    try {
      const { needsEmail, next } = await completeLibraryLink(emailFromPrompt);
      if (needsEmail) return setState("ask-email");
      goTo(next);
    } catch {
      setState("error");
    }
  };

  useEffect(() => {
    if (started.current) return; // avoid running twice in StrictMode
    started.current = true;
    if (!isLibraryLink()) setState("invalid");
    else void finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) void finish(email.trim());
  };

  return (
    <div
      className="grid min-h-screen place-items-center px-6"
      style={{
        backgroundColor: COLORS.sand,
        fontFamily: "'Raleway', sans-serif",
      }}
    >
      <div className="max-w-sm text-center" style={{ color: COLORS.bark }}>
        {state === "working" && <p className="text-sm">Signing you in…</p>}

        {state === "ask-email" && (
          <>
            <p className="text-sm">
              Looks like you opened the link on a different device. Please
              confirm your email to continue.
            </p>
            <form
              onSubmit={handleSubmit}
              className="mt-4 flex items-center rounded-lg border border-[#d6d1c7] bg-white p-1"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                aria-label="Email"
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none"
              />
              <button
                type="submit"
                className="rounded-md px-3 py-2 text-sm font-semibold text-white"
                style={{ backgroundColor: COLORS.sage }}
              >
                Continue
              </button>
            </form>
          </>
        )}

        {(state === "invalid" || state === "error") && (
          <>
            <p className="text-sm">
              {state === "invalid"
                ? "This link isn't valid."
                : "This link has expired or was already used."}
            </p>
            <Link
              to="/signin"
              className="mt-3 inline-block text-sm font-semibold underline underline-offset-2"
            >
              Request a new link
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default FinishSignIn;
