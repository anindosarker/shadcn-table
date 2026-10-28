import { keepPreviousData, useQuery } from '@tanstack/react-query'; //note: this is TanStack React Query V5
import { getUsers, type UsersQueryParams } from '../lib/users.service';

export function useUsersQuery(params: UsersQueryParams) {
  return useQuery({
    queryKey: ['users', params], //new params, new cache entry, new request
    queryFn: () => getUsers(params),
    placeholderData: keepPreviousData, //keep the old page on screen while the next one loads
  });
}
