import { queryOptions, useMutation, useQuery } from "@tanstack/react-query"
import type { QueryFunction } from "@tanstack/react-query";
import type { Thread } from "@/types/thread";
import http from "@/config/http"

export const getThreadsQueryOption = () => {
  return queryOptions({
    queryKey: ['threads'],
    queryFn: (() => {
      return http.get('/threads');
    }) satisfies QueryFunction<Array<Thread>>,
    enabled: !!localStorage.getItem('accessToken'),
  })
}

export const useThreads = () => {
  return useQuery(getThreadsQueryOption())
}

export type NewThreadPayload = {
  content: string;
  attachments?: Array<any>;
};

export const useNewThread = () => {
  return useMutation({
    mutationKey: ['new-thread'],
    mutationFn: (payload: NewThreadPayload) => {
      return http.post('/threads', payload);
    },
  });
}
