<template>
  <div class="w-full">
    <label class="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700" :for="name">
      {{ props.label }}
    </label>
    <input
      v-bind="$attrs"
      :type="props.type"
      :name="name"
      :id="name"
      :placeholder="props.placeholder"
      v-model="inputValue"
      class="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
      @input="updateValue(inputValue)"
    />
    <p v-if="props.hint" class="text-xs text-gray-600">{{ props.hint }}</p>
    <ul class="list-none">
      <li v-for="error of props.errors" :key="error.$uid" data-testid="error-message" class="text-xs text-red-500">
        {{ error.$message }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';

  interface BaseInputProps {
    modelValue: string | number;
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    isDecimal?: boolean;
    errors?: Array<any>;
    hint?: string;
  }

  const props = withDefaults(defineProps<BaseInputProps>(), {
    type: 'text',
  });

  const inputValue = ref<string | number>(props.modelValue);

  const emit = defineEmits<{
    (event: 'update:modelValue', payload: string | number): void;
  }>();

  const formatValue = (value: string): string => {
    const removeChar = value.replace(/[^\d.]/g, '');
    return removeChar;
  };

  const updateValue = (value: string | number) => {
    if (props.isDecimal) {
      inputValue.value = formatValue(String(value));
    } else {
      inputValue.value = value;
    }

    emit('update:modelValue', inputValue.value);
  };

  watch(
    () => props.modelValue,
    (newInputValue) => {
      inputValue.value = newInputValue;
    },
  );
</script>

<style scoped></style>
