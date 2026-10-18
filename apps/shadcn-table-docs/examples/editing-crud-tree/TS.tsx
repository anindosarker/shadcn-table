'use client';

import { useMemo, useState } from 'react';
import {
  ShadcnTable,
  createRow,
  type ST_ColumnDef,
  type ST_Row,
  type ST_TableOptions,
  useShadcnTable,
} from '@/components/ui/shadcn-table';
import { ST_Tooltip } from '@/components/ui/shadcn-table/ST_Tooltip';
import { Button } from '@/components/ui/button';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { type User, fakeData, usStates } from './makeData';
import { PencilIcon, Trash2Icon, UserPlusIcon } from 'lucide-react';

const Example = () => {
  const [creatingRowIndex, setCreatingRowIndex] = useState<
    number | undefined
  >();
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const columns = useMemo<ST_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
        stEditTextFieldProps: {
          required: true,
          'aria-invalid': !!validationErrors?.firstName,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              firstName: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        stEditTextFieldProps: {
          required: true,
          'aria-invalid': !!validationErrors?.lastName,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              lastName: undefined,
            }),
        },
      },
      {
        accessorKey: 'city',
        header: 'City',
        stEditTextFieldProps: {
          required: true,
          'aria-invalid': !!validationErrors?.city,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              city: undefined,
            }),
        },
      },
      {
        accessorKey: 'state',
        header: 'State',
        editVariant: 'select',
        editSelectOptions: usStates,
        stEditTextFieldProps: {
          'aria-invalid': !!validationErrors?.state,
        },
      },
    ],
    [validationErrors],
  );

  //call CREATE hook
  const { mutateAsync: createUser, isPending: isCreatingUser } =
    useCreateUser();
  //call READ hook
  const {
    data: fetchedUsers = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useGetUsers();
  //call UPDATE hook
  const { mutateAsync: updateUser, isPending: isUpdatingUser } =
    useUpdateUser();
  //call DELETE hook
  const { mutateAsync: deleteUser, isPending: isDeletingUser } =
    useDeleteUser();

  //CREATE action
  const handleCreateUser: ST_TableOptions<User>['onCreatingRowSave'] = async ({
    values,
    row,
    table,
  }) => {
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createUser({ ...values, managerId: row.original.managerId });
    table.setCreatingRow(null); //exit creating mode
  };

  //UPDATE action
  const handleSaveUser: ST_TableOptions<User>['onEditingRowSave'] = async ({
    values,
    table,
  }) => {
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateUser(values);
    table.setEditingRow(null); //exit editing mode
  };

  //DELETE action
  const openDeleteConfirmModal = (row: ST_Row<User>) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(row.original.id);
    }
  };

  const table = useShadcnTable({
    columns,
    data: fetchedUsers,
    createDisplayMode: 'row', // ('modal', and 'custom' are also available)
    editDisplayMode: 'row', // ('modal', 'cell', 'table', and 'custom' are also available)
    enableColumnPinning: true,
    enableEditing: true,
    enableExpanding: true,
    positionCreatingRow: creatingRowIndex, //index where new row is inserted before
    getRowId: (row) => row.id,
    stToolbarAlertBannerProps: isLoadingUsersError
      ? {
          className: 'border-destructive text-destructive',
          children: 'Error loading data',
        }
      : undefined,
    stTableContainerProps: {
      className: 'min-h-[500px]',
    },
    stTableBodyRowProps: ({ row }) => ({
      //conditional styling based on row depth
      className:
        row.depth === 0
          ? '[&>td]:bg-muted/20'
          : row.depth === 1
            ? '[&>td]:bg-muted/50'
            : '[&>td]:bg-muted',
    }),
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateUser,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveUser,
    renderRowActions: ({ row, staticRowIndex, table }) => (
      <div className="flex gap-4">
        <ST_Tooltip title="Edit">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => table.setEditingRow(row)}
          >
            <PencilIcon />
          </Button>
        </ST_Tooltip>
        <ST_Tooltip title="Delete">
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => openDeleteConfirmModal(row)}
          >
            <Trash2Icon />
          </Button>
        </ST_Tooltip>
        <ST_Tooltip title="Add Subordinate">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setCreatingRowIndex((staticRowIndex || 0) + 1);
              table.setCreatingRow(
                createRow(
                  table,
                  {
                    id: null!,
                    firstName: '',
                    lastName: '',
                    city: '',
                    state: '',
                    managerId: row.id,
                    subRows: [],
                  },
                  -1,
                  row.depth + 1,
                ),
              );
            }}
          >
            <UserPlusIcon />
          </Button>
        </ST_Tooltip>
      </div>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        onClick={() => {
          setCreatingRowIndex(table.getRowModel().rows.length); //create new row at bottom of table
          table.setCreatingRow(true);
        }}
      >
        <UserPlusIcon />
        Create New User
      </Button>
    ),
    initialState: {
      columnPinning: { left: ['st-row-actions'], right: [] },
      expanded: true,
      pagination: { pageSize: 20, pageIndex: 0 },
    },
    state: {
      isLoading: isLoadingUsers,
      isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers,
    },
  });

  return <ShadcnTable table={table} />;
};

//CREATE hook (post new user to api)
function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: User) => {
      console.info('create user', user);
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newUserInfo: User) => {
      queryClient.setQueryData(['users'], (_prevUsers: User[]) => {
        const prevUsers: User[] = JSON.parse(JSON.stringify(_prevUsers));
        newUserInfo.subRows = [];
        if (newUserInfo.managerId) {
          const manager = findUserInTree(newUserInfo.managerId, prevUsers);
          if (manager) {
            manager.subRows = [
              ...(manager.subRows || []),
              {
                ...newUserInfo,
                id: `${manager.id}.${(manager.subRows?.length || 0) + 1}`,
              },
            ];
          }
        } else {
          prevUsers.push({
            ...newUserInfo,
            id: `${prevUsers.length + 1}`,
          });
        }
        return [...prevUsers];
      });
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}

//READ hook (get users from api)
function useGetUsers() {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      //send api request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve(fakeData);
    },
    refetchOnWindowFocus: false,
  });
}

//UPDATE hook (put user in api)
function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: User) => {
      console.info('update user', user);
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newUserInfo: User) => {
      queryClient.setQueryData(['users'], (prevUsers: any) => {
        let user = findUserInTree(newUserInfo.id, prevUsers);
        user = { ...user, ...newUserInfo };
        return [...prevUsers];
      });
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}

//DELETE hook (delete user in api)
function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      console.info('delete user', userId);
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (userId: string) => {
      queryClient.setQueryData(['users'], (prevUsers: any) => {
        const newUsers: User[] = JSON.parse(JSON.stringify(prevUsers));
        //remove user
        const user = findUserInTree(userId, newUsers);
        if (user) {
          const manager = findUserInTree(user.managerId, newUsers);
          if (manager) {
            manager.subRows = manager.subRows?.filter(
              (subUser) => subUser.id !== user.id,
            );
          } else {
            return newUsers.filter((user) => user.id !== userId);
          }
        }
        return [...newUsers];
      });
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}

//react query setup in App.tsx
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  );
}

const validateRequired = (value: string) => !!value.length;

function validateUser(user: User) {
  return {
    firstName: !validateRequired(user.firstName)
      ? 'First Name is Required'
      : '',
    lastName: !validateRequired(user.lastName) ? 'Last Name is Required' : '',
  };
}

function findUserInTree(managerId: string | null, users: User[]): User | null {
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === managerId) {
      return users[i];
    }
    if (users[i].subRows) {
      const found = findUserInTree(managerId, users[i].subRows!);
      if (found) return found;
    }
  }
  return null;
}
