import { queryOptions, useQuery } from "@tanstack/react-query"
import type { QueryFunction } from "@tanstack/react-query";
import type { User } from "@/types/user"
import http from "@/config/http"

export const getMeQueryOption = () => {
  return queryOptions({
    queryKey: ['me'],
    queryFn: (() => {
      return http.get('/user/profile');
    }) satisfies QueryFunction<User>,
    enabled: !!localStorage.getItem('accessToken')
  })
}

export const useGetMe = () => {
  return useQuery(getMeQueryOption())
}
