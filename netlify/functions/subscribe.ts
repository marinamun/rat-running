// Netlify Function: adds an email to your Kit form.
// The API key stays on the server, set as an environment variable in Netlify:
//   KIT_API_KEY = your Kit v4 API key
//   KIT_FORM_ID = 10065756

const KIT_API = "https://api.kit.com/v4";

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const apiKey = process.env.KIT_API_KEY;
  const formId = process.env.KIT_FORM_ID;
  if (!apiKey || !formId) {
    console.error("Missing env vars", {
      hasKey: !!apiKey,
      hasFormId: !!formId,
    });
    return Response.json({ error: "Server not configured" }, { status: 500 });
  }

  let email = "";
  try {
    const body = await req.json();
    email = String(body.email ?? "")
      .trim()
      .toLowerCase();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json(
      { error: "Please enter a valid email" },
      { status: 400 },
    );
  }

  const headers = {
    "Content-Type": "application/json",
    "X-Kit-Api-Key": apiKey,
  };

  // 1. Create the subscriber (or update it if it already exists)
  const createRes = await fetch(`${KIT_API}/subscribers`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email_address: email }),
  });
  if (!createRes.ok) {
    console.error(
      "Kit create subscriber failed",
      createRes.status,
      await createRes.text(),
    );
    return Response.json({ error: "Could not subscribe" }, { status: 502 });
  }

  // 2. Add the subscriber to your form
  const formRes = await fetch(`${KIT_API}/forms/${formId}/subscribers`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email_address: email }),
  });
  if (!formRes.ok) {
    console.error(
      "Kit add to form failed",
      formRes.status,
      await formRes.text(),
    );
    return Response.json({ error: "Could not subscribe" }, { status: 502 });
  }

  return Response.json({ ok: true });
};
