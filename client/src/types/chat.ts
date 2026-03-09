export type Message = {
  _id: string;
  threadId: string;
  role: "user" | "assistant" | "system"; // "user", "assistant", or "system"
  content: string;
  attachments: Array<{
    type: string;
    url: string;
  }>,
}