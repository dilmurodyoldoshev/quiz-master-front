export const API_URL = "http://localhost:8080/api";
export const WS_URL = "ws://localhost:8080/ws"; // backend WebSocket endpoint

// WebSocket class
export class ConnectWebSocket {
    constructor(onMessage) {
        this.socket = new WebSocket(WS_URL);

        this.socket.onopen = () => {
            console.log("WebSocket connected ✅");
        };

        this.socket.onmessage = (event) => {
            console.log("Message received:", event.data);
            if (onMessage) onMessage(JSON.parse(event.data));
        };

        this.socket.onclose = () => {
            console.log("WebSocket disconnected ❌");
        };

        this.socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    }

    sendMessage(message) {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.error("WebSocket is not open");
        }
    }

    close() {
        this.socket.close();
    }
}
