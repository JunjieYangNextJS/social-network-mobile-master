import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import baseUrl from '../../utils/baseUrl';
import { getItemAsync } from 'expo-secure-store';
import { Post, PostFilterAbout, SortByValue } from '../../../types';

export function usePosts (option: PostFilterAbout ,sortByValue: SortByValue) {
  
    return useQuery({queryKey: ['posts'], queryFn: async () => {
        const token = await getItemAsync("token");

        return axios.get(`${baseUrl}/posts?about=${option}&sort=${sortByValue}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then(res => res.data.data.data as Post[])
    }
        
          
    })
}
