export const dynamic = "force-dynamic";

export async function GET(req) {
    if (process.env.NEXT_PUBLIC_OUTPUT_MODE === 'export') {
        return new Response(JSON.stringify({ error: "API not available in export mode" }), { status: 404 });
    }
    // Your actual logic
    return new Response(JSON.stringify({ questions: ["Q1", "Q2"] }), { status: 200 });
}