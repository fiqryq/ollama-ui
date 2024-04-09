export async function POST(request: Request) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/chat`, {
            method: 'POST',
            body: JSON.stringify({
                model: "llama2",
                messages: [
                    {
                        role: "user",
                        content: `${request}`
                    }
                ],
                stream: false
            })
        })
        const data = await response.json()
        return Response.json(data)
    } catch (error) {
        console.log(error)
    }
}