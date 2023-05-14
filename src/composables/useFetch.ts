import axios from 'axios';
import { notify } from 'notiwind';
import { Ref, ref } from 'vue';

const api = 'http://91.193.43.93:3000';

export default function useFetch<T>(entity: string) {
  const data = ref<Array<T>>([]) as Ref<Array<T>>;

  const setData = async () => {
    try {
      await axios.get<Array<T>>(`${api}${entity}`).then((response) => {
        data.value = response.data;
      });
    } catch (error) {
      notify(
        {
          group: 'error',
          title: 'Error',
          text: 'Error occured',
        },
        4000,
      );
    }
  };

  return { data, setData };
}
