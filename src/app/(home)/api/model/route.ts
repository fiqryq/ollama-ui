export async function GET() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tags`)
    const data = await response.json()
    return Response.json(data.models)
}
