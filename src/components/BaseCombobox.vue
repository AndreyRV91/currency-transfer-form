<template>
  <div>
    <label class="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700" :for="props.name">
      {{ props.label }}
    </label>
    <div class="relative">
      <select
        :id="props.name"
        v-model="selectedItem"
        @change="updateValue(selectedItem)"
        @keyup="onKeyUp"
        v-bind="$attrs"
        class="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
      >
        <option v-for="item of items" :key="item.id" :value="item">{{ item.name }}</option>
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <Icon name="arrow_down" class="h-4 w-4" />
      </div>
    </div>
    <ul class="list-none">
      <li v-for="error of props.errors" :key="error.$uid" class="text-xs text-red-500">
        {{ error.$message }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import Icon from './Icon.vue';

  export interface ComboboxItem {
    id: number;
    name: string;
    selected?: unknown;
  }

  interface BaseInputProps {
    modelValue: ComboboxItem | null;
    label: string;
    name: string;
    items: Array<ComboboxItem>;
    errors?: Array<any>;
  }

  const props = defineProps<BaseInputProps>();

  const selectedItem = ref<ComboboxItem | null>(props.modelValue);

  const emit = defineEmits<{
    (event: 'update:modelValue', payload: ComboboxItem | null): void;
  }>();

  const updateValue = (value: ComboboxItem | null) => {
    if (!value) {
      selectedItem.value = null;
    }
    emit('update:modelValue', value);
  };

  watch(
    () => props.items,
    () => {
      if (props.modelValue && !props.items.find((item) => props.modelValue?.id === item.id)) {
        updateValue(null);
      }
    },
    { deep: true },
  );

  const onKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      updateValue(null);
    }
  };
</script>

<style scoped></style>
