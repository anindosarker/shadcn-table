export type User = {
  firstName: string;
  lastName: string;
  address: string;
  state: string;
  phoneNumber: string;
  lastLogin: string;
};

//the query params YOUR server accepts
export type UsersQueryParams = {
  page: number; //1-based
  limit: number;
  search?: string;
  sortBy?: string[]; //"lastName:desc"
  filter?: string[]; //"state[$contains]=tex"
};

//the page shape YOUR server returns
export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};

export async function getUsers(
  params: UsersQueryParams,
): Promise<PaginatedResponse<User>> {
  const url = new URL('/api/users', location.origin);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    //arrays become repeated keys: sortBy=a&sortBy=b
    for (const item of [value].flat()) {
      url.searchParams.append(key, String(item));
    }
  }
  const response = await fetch(url);
  if (!response.ok) throw new Error(`GET /api/users: ${response.status}`);
  return response.json();
}
