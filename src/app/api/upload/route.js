export const runtime = "nodejs"; // Explicitly use nodejs runtime

export async function POST(req) {
  try {
    const body = await req.json();
    const { fileBase64, fileName } = body;

    const supabaseUrl = "https://tpmjohhfasdshvfvicxc.supabase.co";
    const bucket = "product";
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const buffer = Buffer.from(fileBase64, "base64");

    const uploadRes = await fetch(`${supabaseUrl}/storage/v1/object/${bucket}/${fileName}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/octet-stream",
      },
      body: buffer,
    });

    if (!uploadRes.ok) {
      const error = await uploadRes.text();
      return new Response(JSON.stringify({ error }), { status: 500 });
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${fileName}`;
    return new Response(JSON.stringify({ url: publicUrl }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Upload failed", detail: err.message }), { status: 500 });
  }
}
