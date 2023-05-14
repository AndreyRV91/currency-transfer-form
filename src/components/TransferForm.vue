<template>
  <form class="w-full flex flex-col gap-y-4" @submit.prevent="submitHandler">
    <BaseCombobox
      v-model="v.sender.$model"
      :errors="v.sender.$errors"
      name="from"
      label="From"
      :items="filteredSenders"
    />

    <BaseCombobox
      v-model="v.recepient.$model"
      :errors="v.recepient.$errors"
      name="to"
      label="To"
      :items="filteredRecepients"
    />
    <BaseCombobox
      v-model="v.currency.$model"
      :errors="v.currency.$errors"
      name="currencies"
      label="Currency"
      :items="filteredCurrencies"
    />
    <BaseInput
      v-model="v.amount.$model"
      :errors="v.amount.$errors"
      label="Amount"
      name="amount"
      :hint="amountHint"
      is-decimal
    />
    <BaseButton :is-loading="isSubmitting" type="submit" color="primary" class="p-2 px-8 self-start">Send</BaseButton>
  </form>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import BaseButton from './BaseButton.vue';
  import BaseInput from './BaseInput.vue';
  import BaseCombobox, { ComboboxItem } from './BaseCombobox.vue';
  import { notify } from 'notiwind';

  import { useVuelidate } from '@vuelidate/core';
  import { required, helpers } from '@vuelidate/validators';
  import { Currency, User } from '../types';
  import useFetch from '../composables/useFetch';
  import { checkDecimalPrecision, isFirstGreater, generateDecimalHintString } from '../utils';

  const { data: currencies, setData: setCurrencies } = useFetch<Currency>('/currencies');
  setCurrencies();

  const { data: allUsers, setData: setUsers } = useFetch<User>('/users');
  setUsers();

  const amount = ref('0');
  const sender = ref<ComboboxItem | null>(null);
  const recepient = ref<ComboboxItem | null>(null);
  const currency = ref<ComboboxItem | null>(null);

  const decimals = computed(() => {
    return currencies.value.find((cur) => cur.id === currency.value?.id)?.decimals;
  });

  const maxAmount = computed(() => {
    if (!currency.value || !sender.value) {
      return '';
    }
    const senderCurrencies = allUsers.value.find((user) => user.id === sender.value?.id)?.currencies;
    return senderCurrencies ? senderCurrencies[(currency.value.selected as Currency).code] : '';
  });

  const amountHint = computed(() => {
    let hints = [];
    if (decimals.value) {
      hints.push(`Decimal format for this currency is ${generateDecimalHintString(decimals.value)}`);
    }
    if (maxAmount.value) {
      hints.push(`Max amount ${maxAmount.value}`);
    }
    return hints.join('. ');
  });

  const mustBePositiveDecimal = (value: string) => {
    return checkDecimalPrecision(value, decimals.value) && Number(value) > 0;
  };

  const mustBeLessThanMaxAmount = (value: string) => {
    if (maxAmount.value) {
      return isFirstGreater(maxAmount.value, value);
    }
  };

  const rules = computed(() => ({
    sender: {
      required,
    },
    recepient: {
      required,
    },
    amount: {
      mustBeDecimal: helpers.withMessage(
        'Amount should follow decimal format for this currency',
        mustBePositiveDecimal,
      ),
      mustBeLessThanMaxAmount: helpers.withMessage(`Amount should be less than max amount`, mustBeLessThanMaxAmount),
    },
    currency: {
      required,
    },
  }));

  const v = useVuelidate(rules, { amount, currency, sender, recepient });

  const isSubmitting = ref(false);
  const submitHandler = async () => {
    v.value.$touch();
    if (v.value.$error) {
      return;
    }

    try {
      isSubmitting.value = true;
      // TODO post
    } catch (error) {
      notify(
        {
          group: 'error',
          title: 'Error',
          text: 'Error occured',
        },
        4000,
      );
    } finally {
      isSubmitting.value = false;
    }
  };

  function toComboboxItem<T extends ComboboxItem>(items: Array<T>): Array<ComboboxItem> {
    return items.map((item) => ({ id: item.id, name: item.name, selected: item }));
  }

  const filteredRecepients = computed(() => {
    return toComboboxItem(filterUsers(sender.value));
  });

  const filteredSenders = computed(() => {
    return toComboboxItem(filterUsers(recepient.value));
  });

  const filteredCurrencies = computed(() => {
    return toComboboxItem(filterCurrency(sender.value));
  });

  const filterUsers = (user: ComboboxItem | null): Array<User> => {
    let filteredUsers = allUsers.value.filter((usr) => usr.id !== user?.id);
    const currenyCode = currencies.value.find((cur) => cur.id === currency.value?.id)?.code;
    if (currenyCode) {
      filteredUsers = filteredUsers.filter((user) => Object.keys(user.currencies).includes(String(currenyCode)));
    }
    return filteredUsers;
  };

  const filterCurrency = (user: ComboboxItem | null): Array<Currency> => {
    if (user?.selected) {
      return currencies.value.filter((cur) =>
        Object.keys((user?.selected as User).currencies).includes(String(cur.code)),
      );
    }
    return currencies.value;
  };
</script>

<style scoped></style>
