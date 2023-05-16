import axios, { AxiosResponse } from 'axios';
import { notify } from 'notiwind';
import { Ref, ref } from 'vue';

const baseUrl = process.env.VUE_APP_BASE_URL;

type HttpMethod = 'GET' | 'POST';
interface UseFetchOptions {
  url: string;
  method: HttpMethod;
  fetchSuccess?: () => void;
}

interface UseFetchResult<T, TBody = any> {
  fetchData: (body?: TBody) => Promise<void>;
  data: Ref<T | null>;
  isLoading: Ref<boolean>;
}

export default function useFetch<T, TBody = any>(options: UseFetchOptions): UseFetchResult<T, TBody> {
  const data: Ref<T | null> = ref(null);
  const error = ref<string>('');
  const isLoading = ref<boolean>(false);

  const fetchData = async (body?: TBody): Promise<void> => {
    try {
      isLoading.value = true;
      error.value = '';

      const response: AxiosResponse<T> = await axios({
        url: `${baseUrl}${options.url}`,
        method: options.method,
        headers: {
          'Content-Type': 'application/json',
        },
        data: body,
      });
      data.value = response.data || null;
      options.fetchSuccess?.();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err;
        error.value = axiosError.response?.data.message || 'An error occurred';
      } else {
        error.value = 'An error occurred';
      }
      notify(
        {
          group: 'error',
          title: 'Error',
          text: error.value,
        },
        4000,
      );
      data.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  return { data, fetchData, isLoading };
}
