interface Message {
    role: string;
    content: string;
}

interface ApiResponse {
    model: string;
    messages: Message[];
    stream: boolean
}

export const buildResponse = (model: string, messages: Message[], stream: boolean = false): ApiResponse => {
    return {
        model: model,
        messages: messages,
        stream: stream
    };
}
