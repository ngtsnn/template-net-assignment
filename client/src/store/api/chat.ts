import { queryOptions, useMutation, useQuery } from "@tanstack/react-query"
import type { QueryFunction } from "@tanstack/react-query";
import type { Message } from "@/types/chat";
import http from "@/config/http"

export const getChatQueryOption = (id:string) => {
  return queryOptions({
    queryKey: ['threads', id],
    queryFn: (() => {
      return http.get(`/threads/${id}/messages`);
    }) satisfies QueryFunction<Array<Message>>,
    enabled: !!localStorage.getItem('accessToken') && !!id,
  })
}

export const useChat = (id: string) => {
  return useQuery(getChatQueryOption(id))
}

export type NewMessagePayload = {
  content: string;
  attachments?: Array<any>;
};

export const useNewMessage = (threadId: string) => {
  return useMutation({
    mutationKey: ['new-message', threadId],
    mutationFn: (payload: NewMessagePayload) => {
      return http.post(`/threads/${threadId}/messages`, payload);
    },
  });
}
