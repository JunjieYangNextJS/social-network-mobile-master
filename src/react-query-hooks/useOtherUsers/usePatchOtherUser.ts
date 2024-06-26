import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import baseUrl from '../../utils/baseUrl';
import { Role, User } from '../../../types';
import { getItemAsync } from 'expo-secure-store';



export default function usePatchOtherUser(
  otherUserUsername: string,
  otherUserId: string,
  keep: string | number | boolean
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn:  values =>
    axios
      .patch(`${baseUrl}/users/${otherUserId}/updateOtherUser`, values, {
        withCredentials: true,
 
      })
      .then(res => res.data),

    // onError: () => {
    //     showError('Something went wrong');
    //   },
    onSuccess: data => {
        queryClient.invalidateQueries({queryKey: ['user', otherUserUsername]});
        !keep && queryClient.invalidateQueries({queryKey:['user']});
      }
  }
   

      
    
  );
}

export function usePatchOtherUserFriendRequest(
  otherUserUsername: string,
  method: string,
  otherUserId: string,
  onClose: () => void
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (friendRequest: {
      userId: string,
      username: string,
      profileName: string,
      photo: string,
      role: Role,
      message: string,
    }) => {
      const token = await getItemAsync("token");
      return axios.patch(
        `${baseUrl}/users/${otherUserId}/${method}`,
        friendRequest,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
    
        }
        )
    }
        ,

    onSuccess: () => {
        queryClient.invalidateQueries({queryKey:['user', otherUserUsername], exact: true});
        queryClient.invalidateQueries({queryKey:['user'], exact: true});
        onClose()
      }
  }
    
    // .then((res) => res.data),
    
      
    
  );
}

export function useFollowOtherUser(
  otherUserId: string,
  otherUserUsername: string,
  otherUserFollowers: string[],
  myId: string,
  myUsername: string
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const token = await getItemAsync("token");

      return axios
      .patch(
        `${baseUrl}/users/${otherUserId}/followOtherUser`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
    
        }
      )
      .then(res => res.data.data)
    }
    ,

    onMutate: async () => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries({queryKey: ['user', otherUserUsername]});

        // // Snapshot the previous value
        const previousOtherUser = queryClient.getQueryData([
          'user',
          otherUserUsername
        ]);

        if (!previousOtherUser) throw new Error("The other user's info is found!")

        // // Optimistically update to the new value
        queryClient.setQueryData(['user', otherUserUsername], {
          ...previousOtherUser,
          followers: [...otherUserFollowers, myId]
        });

        // // Return a context with the previous and new todo
        return { previousOtherUser };
      },
    onError: (_err, _newTodo, context) => {
        if (!context?.previousOtherUser) return;

        queryClient.setQueryData(
          ['user', otherUserUsername],
          context.previousOtherUser
        );
      },
    onSettled: data => {
        // queryClient.invalidateQueries(["user", otherUserUsername]);
        if(otherUserUsername && data) {
          queryClient.setQueryData(['user', otherUserUsername], data);
        }
        
      queryClient.invalidateQueries({queryKey: [myUsername, 'following']})
      }
  }
    
    
      
    
  );
}

export function useUnfollowOtherUser(
  otherUserId: string,
  otherUserUsername: string,
  otherUserFollowers: string[],
  myId: string,
  myUsername: string
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      
      const token = await getItemAsync("token");
      return axios
      .patch(
          `${baseUrl}/users/${otherUserId}/unfollowOtherUser`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
      
          }
      )
      .then(res => res.data.data)
    }
        ,

    onMutate: async () => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({queryKey: ['user', otherUserUsername]});
    
            // // Snapshot the previous value
            const previousOtherUser = queryClient.getQueryData([
              'user',
              otherUserUsername
            ]);
    
            if (!previousOtherUser) throw new Error("The other user's info is found!")

            // // Optimistically update to the new value
            queryClient.setQueryData(['user', otherUserUsername], {
              ...previousOtherUser,
              followers: otherUserFollowers.filter(id => id !== myId)
            });
    
            // // Return a context with the previous and new todo
            return { previousOtherUser };
          },
    onError: (_err, _newTodo, context) => {
        if (!context?.previousOtherUser) return;

            queryClient.setQueryData(
              ['user', otherUserUsername],
              context.previousOtherUser
            );
          },
    onSettled: data => {
            // queryClient.invalidateQueries(["user", otherUserUsername]);
            if(otherUserFollowers && data) {
              queryClient.setQueryData(['user', otherUserUsername], data);
            }
            
            queryClient.invalidateQueries({queryKey: [myUsername, 'following']})
          }
  }
    
 
  );
}
