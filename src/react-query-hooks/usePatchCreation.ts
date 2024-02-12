import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import baseUrl from '../utils/baseUrl';
import { BackendRoutes } from '../../types';
import { getItemAsync } from 'expo-secure-store';

export default function usePatchCreation(route: BackendRoutes, parentId: string) {
    return useMutation({
        mutationFn: (values: any) =>
        axios.patch(`${baseUrl}/${route}/${parentId}`, values, {
          withCredentials: true,
       
        })
    }
      
      // .then((res) => res.data)
    );
  }
  export function usePatchCreationSubscribers(route: BackendRoutes, parentId: string) {
    return useMutation({
        mutationFn: async (values : {isSubscribed: boolean}) => {
          const token = await getItemAsync('token')
          return axios.patch(
            `${baseUrl}/${route}/${parentId}/update-subscribers`,
            values,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
          
            }
          )
        }
        
    }
      

    );
  }