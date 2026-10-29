import { useEffect, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { hasAccess, useAuth } from "../auth/AuthProvider";
import {
  goTo,
  safeNext,
  sendLibraryLink,
  signInWithGoogle,
} from "../auth/signIn";

const COLORS = {
  sand: "#F3EFE4",
  bark: "#4A3A2E",
  sage: "#9AA77C",
};

type Status = "idle" | "sending" | "sent" | "error";

// /signin?next=/resources/file.pdf
// Shown when a signed-out visitor opens one of your study notes
const SignIn = () => {
  const { user, loading } = useAuth();
  const [params] = useSearchParams();
  const next = safeNext(params.get("next"));
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [wantsUpdates, setWantsUpdates] = useState(false);

  const signedIn = !loading && hasAccess(user);

  // Already signed in: go straight to what they wanted
  useEffect(() => {
    if (signedIn) goTo(next);
  }, [signedIn, next]);

  if (signedIn) return null;

  const handleEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    try {
      await sendLibraryLink(email.trim(), next, wantsUpdates);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle(wantsUpdates);
      goTo(next);
    } catch (err) {
      console.error("Google sign-in failed", err);
    }
  };
  return (
    <div
      className="grid min-h-screen place-items-center px-6 py-14"
      style={{
        backgroundColor: COLORS.sand,
        fontFamily: "'Raleway', sans-serif",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500&family=Raleway:wght@400;600;700&display=swap');`}</style>

      <div className="w-full max-w-sm">
        <Link
          to="/library"
          className="text-xs font-semibold underline-offset-2 hover:underline"
          style={{ color: COLORS.bark }}
        >
          ← Back to the library
        </Link>

        <h1
          className="mt-4 text-4xl leading-tight"
          style={{ fontFamily: "'Fraunces', serif", color: COLORS.bark }}
        >
          Open the study notes
        </h1>
        <p className="mt-2 text-sm text-[#8a8278]">
          My study notes are free. Sign in once so we know you're a real person,
          not a bot.
        </p>

        {status === "sent" ? (
          <div className="mt-8 text-sm" style={{ color: COLORS.bark }}>
            <p className="font-semibold">Check your inbox 📬</p>
            <p className="mt-1">
              We sent a sign-in link to <strong>{email}</strong>. Click it to
              open the notes. It can take a minute, and might land in spam.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-2 text-xs underline underline-offset-2"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <div className="mt-8 flex flex-col gap-4">
            <button
              type="button"
              onClick={handleGoogle}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#d6d1c7] bg-white px-3 py-2.5 text-sm font-semibold transition-colors hover:border-[#4A3A2E]"
              style={{ color: COLORS.bark }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
                />
                <path
                  fill="#FF3D00"
                  d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"
                />
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-3 text-xs text-[#8a8278]">
              <span className="h-px flex-1 bg-[#d6d1c7]" />
              or
              <span className="h-px flex-1 bg-[#d6d1c7]" />
            </div>

            <form
              onSubmit={handleEmail}
              className="flex w-full items-center rounded-lg border border-[#d6d1c7] bg-white p-1"
            >
              <label htmlFor="signin-email" className="sr-only">
                Email
              </label>
              <input
                id="signin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none"
                style={{ color: COLORS.bark }}
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className="rounded-md px-3 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-85 disabled:opacity-60"
                style={{ backgroundColor: COLORS.sage }}
              >
                {status === "sending" ? "Sending…" : "Email me a link"}
              </button>
            </form>

            {status === "error" && (
              <p className="text-xs text-red-700">
                Something went wrong. Please check your email and try again.
              </p>
            )}

            <label
              className="flex cursor-pointer items-start gap-2 text-xs leading-relaxed"
              style={{ color: COLORS.bark }}
            >
              <input
                type="checkbox"
                checked={wantsUpdates}
                onChange={(e) => setWantsUpdates(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#9AA77C]"
              />
              <span>
                Add me to the Learn &amp; Help Animals mailing list to hear
                about new resources and features. You can unsubscribe at any
                time.
              </span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignIn;
