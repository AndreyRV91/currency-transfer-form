<template>
  <button
    :disabled="isLoading"
    class="flex justify-center rounded text-sm transition duration-150 ease-in-out"
    :class="getClass"
  >
    <Icon v-show="isLoading" name="spinner" class="absolute h-5 w-5 animate-spin" />

    <span :class="{ invisible: isLoading }">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import Icon from './Icon.vue';

  type ButtonTypes = 'primary' | 'secondary';

  interface BaseButtonProps {
    isLoading?: boolean;
    color: ButtonTypes;
  }

  const props = withDefaults(defineProps<BaseButtonProps>(), {
    isLoading: false,
    color: 'primary',
  });

  const getClass = computed(() => {
    return {
      'cursor-arrow': props.isLoading,
      'hover:enabled:bg-violet-600 bg-violet-700 text-white': props.color === 'primary',
      'hover:enabled:border-gray-400 hover:enabled:bg-gray-300 bg-gray-100 text-gray-600 border':
        props.color === 'secondary',
    };
  });
</script>

<style scoped></style>
