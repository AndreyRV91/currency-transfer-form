<script setup lang="ts">
  import TransferForm from './components/TransferForm.vue';
  import BaseWrapper from './components/BaseWrapper.vue';
  import NotificationContainer from './components/NotificationContainer.vue';
</script>

<template>
  <div class="flex h-screen items-center justify-center">
    <BaseWrapper>
      <TransferForm />
    </BaseWrapper>
    <NotificationContainer />
  </div>
</template>

<style scoped></style>
