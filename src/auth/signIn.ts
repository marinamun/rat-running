import {
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";

// Netlify function that adds an email to Kit (same one the newsletter form uses)
const SUBSCRIBE_URL = "/.netlify/functions/subscribe";

const EMAIL_KEY = "lha-signin-email";
const NEXT_KEY = "lha-signin-next";
const UPDATES_KEY = "lha-signin-updates";

const storage = {
  get: (k: string) => {
    try {
      return window.localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k: string, v: string) => {
    try {
      window.localStorage.setItem(k, v);
    } catch {
      /* private mode: ignore */
    }
  },
  remove: (k: string) => {
    try {
      window.localStorage.removeItem(k);
    } catch {
      /* ignore */
    }
  },
};

// Adds the email to Kit. Only called when the user ticked the checkbox.
async function subscribeToKit(email: string) {
  try {
    await fetch(SUBSCRIBE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
  } catch {
    // Not critical: sign-in still works
  }
}

// Only allow returning to pages/files on our own site
export const safeNext = (next: string | null | undefined) =>
  next && next.startsWith("/") && !next.startsWith("//") ? next : "/library";

// Send the user where they wanted to go. Files (e.g. PDFs) need a full page load.
export const goTo = (next: string) => {
  window.location.assign(next);
};

// Step 1: email the user a sign-in link
export async function sendLibraryLink(
  email: string,
  next: string,
  wantsUpdates: boolean,
) {
  await sendSignInLinkToEmail(auth, email, {
    url: `${window.location.origin}/finish-signin`,
    handleCodeInApp: true,
  });
  storage.set(EMAIL_KEY, email);
  storage.set(NEXT_KEY, next);
  storage.set(UPDATES_KEY, wantsUpdates ? "1" : "0");
}

export const isLibraryLink = () =>
  isSignInWithEmailLink(auth, window.location.href);

// Step 2: user clicked the link in their inbox -> sign them in.
// If they opened the link on another device, we ask for the email again.
export async function completeLibraryLink(emailFromPrompt?: string) {
  const email = emailFromPrompt ?? storage.get(EMAIL_KEY);
  if (!email) return { needsEmail: true as const, next: "/library" };

  await signInWithEmailLink(auth, email, window.location.href);
  const next = safeNext(storage.get(NEXT_KEY));
  if (storage.get(UPDATES_KEY) === "1") await subscribeToKit(email);
  storage.remove(EMAIL_KEY);
  storage.remove(NEXT_KEY);
  storage.remove(UPDATES_KEY);
  return { needsEmail: false as const, next };
}

// Alternative: Google sign-in (Google emails are already verified)
export async function signInWithGoogle(wantsUpdates: boolean) {
  const { user } = await signInWithPopup(auth, googleProvider);
  if (wantsUpdates && user.email) await subscribeToKit(user.email);
}
