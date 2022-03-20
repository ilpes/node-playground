import {Message} from "./schemas";

function serializeEvent(message: Message) {
    let payload = "";

    if (message.id) {
        payload += `id: ${message.id}\n`;
    }

    if (message.event) {
        payload += `event: ${message.event}\n`;
    }

    if (message.data) {
        payload += `data: ${JSON.stringify(message.data)}\n`;
    }

    if (message.retry) {
        payload += `retry: ${message.retry}\n`;
    }

    if (payload === "") {
        return "";
    }

    payload += "\n";

    return payload;
}

export {serializeEvent};
