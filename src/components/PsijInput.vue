<script>
import { computed, ref } from 'vue'

import { randomStringGenerator } from '../utils/random-utils.js'

export default {
  name: 'PsijInput',

  inheritAttrs: false,

  props: {
    modelValue: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      default: randomStringGenerator,
    },
    isAllRequired: Boolean,
    isInError: Boolean,
    invalid: Boolean,
    isSyncing: Boolean,
    label: {
      type: String,
      default: 'Label',
    },
    labelAttrs: {
      type: Object,
      default: () => ({}),
    },
    suggestions: {
      type: Array,
      default: () => [],
    },
    suggestionsClass: {
      type: String,
      default: '',
    },
    showSuggestions: {
      type: Boolean,
      default (props) {
        return !!props.suggestions.length
      },
    },
    autocomplete: {
      type: String,
      default: 'off',
    },
    validator: {
      type: Function,
      default: undefined,
    },
  },

  emits: ['update:modelValue', 'select-suggestion'],

  setup (_, ctx) {
    const tmpType = ref(ctx.attrs.type)
    const eyeIcon = computed(() => tmpType.value === 'password' ? 'eye' : 'eye-slash')

    return {
      syncResultIcon: undefined,
      tmpType,
      eyeIcon,
      togglePassword () {
        tmpType.value = tmpType.value === 'password' ? 'text' : 'password'
      },
      selectSuggestion (index) {
        ctx.emit('select-suggestion', index)
      },
    }
  },
}
</script >

<template>
  <div class="input-wrapper  relative">
    <label
      :for="id"
      class="label"
      v-bind="labelAttrs"
    >
      {{ label }}
      <slot name="label" />

      <em
        v-if="$attrs.required && !isAllRequired"
        class="text--alert"
      > * </em></label>

    <div
      class="flex items-center rounded"
    >
      <input
        :id="id"
        v-bind="$attrs"
        class="input"
        :required="$attrs.required"
        :value="modelValue"
        :type="tmpType"
        @input="$emit('update:modelValue', $event.target.value)"
      >
      <div class="mx-2 absolute right-0">
        <VIcon
          v-if="isInError || invalid"
          class="text-lg ml-1 t-cross-in-error"
          name="fa-exclamation-triangle"
        />

        <VIcon
          v-if="isSyncing"
          class="text-lg ml-1 fa-spin t-sync-alt"
          name="fa-sync-alt"
        />

        <VIcon
          v-if="syncResultIcon"
          class="`text-lg  ml-1  t-${syncResultIcon}`"
          name="fa-syncResultIcon"
        />

        <VIcon
          v-if="$attrs.type === 'password' && !$attrs.disabled"
          class="text-gray-600 text-lg ml-1 t-eye-icon"
          :name="`fa-regular-${eyeIcon}`"
          @click="togglePassword()"
        />
      </div>
      <div
        v-if="hasSuggestions && showSuggestions"
        class="relative"
        v-bind="suggestionsDivAttrs"
      >
        <ul class="suggestions">
          <li
            v-for="(suggestion, index) in suggestions"
            :key="index"
            :class="`suggestion   p-1  t-suggestion-${index}`"
            @click.stop.prevent="selectSuggestion(index)"
          >
            <span v-html="suggestion" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style>
.suggestions {
  @apply absolute  w-full left-0  top-0  mt-1  cursor-pointer  rounded  shadow-lg  z-10  bg-blue-100 text-gray-900;

  max-height: 10em;
  overflow: auto;
}

.suggestion:hover {
  @apply bg-blue-200;
}

.input-wrapper,
input {
  width: 100%;
}

input {
  background-color: var(--main-form-input-bg);
  color: var(--main-form-input-font-color);

  &:disabled {
    background-color: var(--main-form-input-disabled-bg);
    color: var(--main-form-input-disabled-font-color);
    cursor: not-allowed;
  }

  &:read-only {
    background-color: var(--main-form-input-readonly-bg);
    color: var(--main-form-input-readonly-font-color);
    cursor: text;
  }
}

.input-label {
  @apply flex;

  color: var(--main-form-label-font-color);
  cursor: inherit;
}

.disabled .input-label {
  cursor: not-allowed;
}

.fa-sync-alt {
  color: var(--main-form-input-font-color)
}

.fa-check-circle {
  color: rgba(72, 187, 120, var(--bg-opacity))
}

.fa-exclamation-triangle {
  color: rgba(245, 101, 101, 0.8)
}
</style>
