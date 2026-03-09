import z from "zod";

export const attachmentSchema = z.object({ type: z.enum(['image', 'pdf']), url: z.url() })

export const messageSchema = z.object({
    content: z.string('Message must have content'),
    attachments: z.array(attachmentSchema)
});

export type MessageSchema = z.infer<typeof messageSchema>;
