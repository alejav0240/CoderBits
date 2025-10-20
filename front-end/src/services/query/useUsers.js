import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../api/usersService';

export const useUsers = (page, limit) => {
    return useQuery({
        queryKey: ['users', page, limit],
        queryFn: () => getUsers(page, limit),
        keepPreviousData: true,
    });
};
