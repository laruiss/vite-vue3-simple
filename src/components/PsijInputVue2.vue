<template>
  <div
    v-show="show"
    class="flex"
    :class="{
      'justify-start  items-center': isCheckbox || isRadio,
      'justify-center': !isCheckbox && !isRadio,
    }"
  >
    <div
      class="input-wrapper"
      :class="{
        'checkmark-container': isCheckbox || isRadio,
        disabled,
        checked: isChecked,
      }"
    >
      <label
        ref="label"
        :for="id"
        class="input-label label flex items-center"
        :class="labelClass"
      >
        {{ label }}

        <slot name="label" />

        <em
          v-if="required && !allRequired"
          class="text--alert"
        > * </em>
      </label>

      <div
        class="flex items-center bg-white rounded"
        :class="{
          relative: !isCheckbox && !isRadio,
        }"
      >
        <input
          :id="id"
          ref="input"
          v-mask="mask || 'X'.repeat(200)"
          :value="value"
          :class="inputClasses"
          :checked="isChecked"
          :aria-checked="isChecked"
          :name="name || false"
          :placeholder="placeholder || false"
          :required="required || false"
          :disabled="disabled || false"
          :aria-required="required || false"
          :type="tmpType"
          :min="min"
          :max="max"
          :autofocus="autofocus"
          :tabindex="tabindex"
          :hasSuggestions="hasSuggestions"
          :autocomplete="autocomplete"
          :readonly="readonly"
          :aria-readonly="readonly"
          @click="$emit('click', $event)"
          @keydown.escape="() => $emit('hide-suggestion')"
          @input="onInput"
          @change="onChange"
          @paste="onPaste"
          @blur="$emit('blur', $event)"
          @keyup.delete="onDelete"
        >

        <div class="mx-2 absolute right-0">
          <fa-icon
            v-if="isInError || invalid"
            class="text-lg ml-1 t-cross-in-error"
            :icon="['fas', 'exclamation-triangle']"
          />

          <fa-icon
            v-if="isSyncing"
            class="text-lg ml-1 fa-spin t-sync-alt"
            :icon="['fas', 'sync-alt']"
          />

          <fa-icon
            v-if="syncResultIcon"
            :class="`text-lg  ml-1  t-${syncResultIcon}`"
            :icon="['fas', syncResultIcon]"
          />

          <fa-icon
            v-if="type === 'password' && !disabled"
            class="text-gray-600 text-lg ml-1 t-eye-icon"
            :icon="['far', eyeIcon]"
            @click="togglePassword"
          />
        </div>

        <span
          v-if="isRadio || isCheckbox"
          :class="{ checkmark: true, radiomark: isRadio }"
          @click="$refs.label.click()"
        />
      </div>

      <div
        v-if="hasSuggestions && showSuggestions"
        class="relative"
        :class="suggestionsClass"
      >
        <ul class="suggestions">
          <li
            v-for="(suggestion, index) in suggestions"
            :key="index"
            :class="`suggestion   p-1  t-suggestion-${index}`"
            @click.stop.prevent="selectSuggestion(suggestion, index)"
          >
            <span v-html="suggestion" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { email as emailRegex } from '@/util'

const saveIcon = 'save'
const timesIcon = 'times-circle'

export default {
  name: 'PsijInput',

  props: {
    autofocus: Boolean,
    checked: Boolean,
    inputClass: {
      type: String,
      default: '',
    },
    allRequired: Boolean,
    isInError: Boolean,
    label: {
      type: String,
      default: '',
    },
    labelClass: {
      type: String,
      default: '',
    },
    isSyncing: Boolean,
    syncedResult: {
      type: Boolean,
      default: undefined,
    },
    placeholder: {
      type: String,
      default: '---',
    },
    name: {
      type: String,
      default: 'name-me',
    },
    mask: {
      type: String,
      default: undefined,
    },
    required: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'text',
    },
    tabindex: {
      type: Number,
      default: 0,
    },
    value: {
      type: [Number, String, Boolean],
      default: undefined,
    },
    min: {
      type: [Number, String],
      default: undefined,
    },
    max: {
      type: [Number, String],
      default: undefined,
    },
    id: {
      type: String,
      default () {
        return [...Array(10)].map(() => Math.random().toString(36)[2]).join('')
      },
    },

    readonly: Boolean,

    show: {
      type: Boolean,
      default: true,
    },

    suggestions: {
      type: Array,
      default: () => [],
    },
    suggestionsClass: {
      type: String,
      default: '',
    },
    disabled: Boolean,
    showSuggestions: {
      type: Boolean,
      default () {
        return !!this.suggestions.length
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

  data () {
    return {
      eyeIcon: 'eye',
      invalid: false,
      tmpType: this.type,
    }
  },

  computed: {
    isCheckbox () {
      return this.type === 'checkbox'
    },
    hasSuggestions () {
      return this.suggestions.length > 0
    },
    isRadio () {
      return this.type === 'radio'
    },
    isText () {
      return this.type === 'text'
    },
    isChecked () {
      return (this.isRadio || this.isCheckbox) && this.checked
    },

    isEmail () {
      return this.type === 'email'
    },

    inputClasses () {
      const typeClass = this.isRadio
        ? 'checkbox rounded-full'
        : this.isCheckbox
          ? 'checkbox'
          : 'input'
      const baseClass = `${typeClass}  ${
        this.isInError || this.invalid ? 'input--alert' : ''
      }`
      if (typeof this.inputClass === 'object') {
        return {
          ...this.inputClass,
          [baseClass]: true,
        }
      }
      return `${this.inputClass}  ${baseClass}`
    },

    syncResultIcon () {
      if (this.syncedResult === undefined) {
        return undefined
      }
      return this.syncedResult ? saveIcon : timesIcon
    },
  },

  watch: {
    value (newVal) {
      if (this.isEmail) {
        const eventName =
          !this.value || emailRegex.test(this.value) ? 'valid' : 'error'
        this.$emit(eventName)
        return
      }

      if (this.validator) {
        this.invalid = !this.validator(this.value)
        const eventName = this.invalid ? 'error' : 'valid'
        this.$emit('validate', !this.invalid)
        this.$emit(eventName)
        return
      }
      this.$emit('valid')
    },
  },

  mounted () {
    if (this.autofocus) {
      this.focus()
    }
  },

  methods: {
    onInput ({ target: elt }) {
      if (this.isRadio) {
        return
      }

      let value = elt.value
      let dirty = value !== this.value
      if (this.isText) {
        value = String(value).trimStart()
      }

      if (this.isCheckbox) {
        value = elt.checked
        dirty = value !== this.checked
      }

      if (dirty) {
        this.$emit('input', value)
      }
    },
    onPaste (evt) {
      this.$emit('paste', evt)
    },
    onChange ({ target }) {
      if (this.isCheckbox) {
        return
      }
      this.$emit('input', target.value)
    },
    onDelete ({ target: elt }) {
      const value = elt.value
      this.$emit('delete', value)
    },
    selectSuggestion (suggestion, index) {
      this.$emit('select-suggestion', index)
    },
    focus () {
      this.$refs.input.focus()
    },
    togglePassword () {
      this.tmpType = this.tmpType === 'password' ? 'text' : 'password'
      this.eyeIcon = this.tmpType === 'password' ? 'eye' : 'eye-slash'
    },
  },
}
</script>

<style lang="postcss" scoped>
/* purgecss start ignore */
.checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 20px;
  width: 20px;
  left: 3px;
  top: 3px;
  z-index: 99;
}

.checkmark {
  position: absolute;
  top: 50%;
  left: 0.5em;
  transform: translateY(-50%);
  height: 25px;
  width: 25px;
  background-color: var(--main-form-input-bg);

  .checkbox:checked ~ & {
    background-color: var(--main-form-input-bg);
  }

  .checkbox:disabled ~ & {
    background-color: var(--main-form-input-disabled-bg);
  }

  .checkbox:focus ~ & {
    @apply outline-none ring;
  }

  &::after {
    content: "";
    position: absolute;
    display: none;
    border: solid var(--dark-blue);
    transform: rotate(45deg);
  }

  &:not(.radiomark)::after {
    border-width: 0 4px 4px 0;
    top: 4px;
    left: 8px;
    width: 9px;
    height: 14px;
  }

  /* Show the checkmark when checked */
  .checkbox:checked ~ &::after {
    display: block;
  }

  &.radiomark {
    border-radius: 50%;

    &::after {
      display: block;
      border-radius: 50%;
      border-width: 0;
      top: 7px;
      left: 7px;
      width: 8px;
      height: 8px;

      :checked ~ & {
        border-width: 6px;
      }
    }
  }
}

.checkmark-container {
  @apply relative block  py-4  pr-2  pl-10  rounded  cursor-pointer;

  margin-bottom: 12px;

  &.checked {
    background-color: var(--dark-blue);
  }
}

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

/* purgecss end ignore */
</style>
        ref="label"
        :for="id"
        class="input-label label flex items-center"
        :class="labelClass"
      >
        {{ label }}

        <slot name="label" />

        <em
          v-if="required && !allRequired"
          class="text--alert"
        > * </em>
      </label>

      <div
        class="flex items-center bg-white rounded"
        :class="{
          relative: !isCheckbox && !isRadio,
        }"
      >
        <input
          :id="id"
          ref="input"
          v-mask="mask || 'X'.repeat(200)"
          :value="value"
          :class="inputClasses"
          :checked="isChecked"
          :aria-checked="isChecked"
          :name="name || false"
          :placeholder="placeholder || false"
          :required="required || false"
          :disabled="disabled || false"
          :aria-required="required || false"
          :type="tmpType"
          :min="min"
          :max="max"
          :autofocus="autofocus"
          :tabindex="tabindex"
          :hasSuggestions="hasSuggestions"
          :autocomplete="autocomplete"
          :readonly="readonly"
          :aria-readonly="readonly"
          @click="$emit('click', $event)"
          @keydown.escape="() => $emit('hide-suggestion')"
          @input="onInput"
          @change="onChange"
          @paste="onPaste"
          @blur="$emit('blur', $event)"
          @keyup.delete="onDelete"
        >

        <div class="mx-2 absolute right-0">
          <fa-icon
            v-if="isInError || invalid"
            class="text-lg ml-1 t-cross-in-error"
            :icon="['fas', 'exclamation-triangle']"
          />

          <fa-icon
            v-if="isSyncing"
            class="text-lg ml-1 fa-spin t-sync-alt"
            :icon="['fas', 'sync-alt']"
          />

          <fa-icon
            v-if="syncResultIcon"
            :class="`text-lg  ml-1  t-${syncResultIcon}`"
            :icon="['fas', syncResultIcon]"
          />

          <fa-icon
            v-if="type === 'password' && !disabled"
            class="text-gray-600 text-lg ml-1 t-eye-icon"
            :icon="['far', eyeIcon]"
            @click="togglePassword"
          />
        </div>

        <span
          v-if="isRadio || isCheckbox"
          :class="{ checkmark: true, radiomark: isRadio }"
          @click="$refs.label.click()"
        />
      </div>

      <div
        v-if="hasSuggestions && showSuggestions"
        class="relative"
        :class="suggestionsClass"
      >
        <ul class="suggestions">
          <li
            v-for="(suggestion, index) in suggestions"
            :key="index"
            :class="`suggestion   p-1  t-suggestion-${index}`"
            @click.stop.prevent="selectSuggestion(suggestion, index)"
          >
            <span v-html="suggestion" />
          </li>
        </ul>
      </div>
    </>
  </div>
</template>

<script>
import { email as emailRegex } from '@/util'

const saveIcon = 'save'
const timesIcon = 'times-circle'

export default {
  name: 'PsijInput',

  props: {
    autofocus: Boolean,
    checked: Boolean,
    inputClass: {
      type: String,
      default: '',
    },
    allRequired: Boolean,
    isInError: Boolean,
    label: {
      type: String,
      default: '',
    },
    labelClass: {
      type: String,
      default: '',
    },
    isSyncing: Boolean,
    syncedResult: {
      type: Boolean,
      default: undefined,
    },
    placeholder: {
      type: String,
      default: '---',
    },
    name: {
      type: String,
      default: 'name-me',
    },
    mask: {
      type: String,
      default: undefined,
    },
    required: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'text',
    },
    tabindex: {
      type: Number,
      default: 0,
    },
    value: {
      type: [Number, String, Boolean],
      default: undefined,
    },
    min: {
      type: [Number, String],
      default: undefined,
    },
    max: {
      type: [Number, String],
      default: undefined,
    },
    id: {
      type: String,
      default () {
        return [...Array(10)].map(() => Math.random().toString(36)[2]).join('')
      },
    },

    readonly: Boolean,

    show: {
      type: Boolean,
      default: true,
    },

    suggestions: {
      type: Array,
      default: () => [],
    },
    suggestionsClass: {
      type: String,
      default: '',
    },
    disabled: Boolean,
    showSuggestions: {
      type: Boolean,
      default () {
        return !!this.suggestions.length
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

  data () {
    return {
      eyeIcon: 'eye',
      invalid: false,
      tmpType: this.type,
    }
  },

  computed: {
    isCheckbox () {
      return this.type === 'checkbox'
    },
    hasSuggestions () {
      return this.suggestions.length > 0
    },
    isRadio () {
      return this.type === 'radio'
    },
    isText () {
      return this.type === 'text'
    },
    isChecked () {
      return (this.isRadio || this.isCheckbox) && this.checked
    },

    isEmail () {
      return this.type === 'email'
    },

    inputClasses () {
      const typeClass = this.isRadio
        ? 'checkbox rounded-full'
        : this.isCheckbox
          ? 'checkbox'
          : 'input'
      const baseClass = `${typeClass}  ${
        this.isInError || this.invalid ? 'input--alert' : ''
      }`
      if (typeof this.inputClass === 'object') {
        return {
          ...this.inputClass,
          [baseClass]: true,
        }
      }
      return `${this.inputClass}  ${baseClass}`
    },

    syncResultIcon () {
      if (this.syncedResult === undefined) {
        return undefined
      }
      return this.syncedResult ? saveIcon : timesIcon
    },
  },

  watch: {
    value (newVal) {
      if (this.isEmail) {
        const eventName =
          !this.value || emailRegex.test(this.value) ? 'valid' : 'error'
        this.$emit(eventName)
        return
      }

      if (this.validator) {
        this.invalid = !this.validator(this.value)
        const eventName = this.invalid ? 'error' : 'valid'
        this.$emit('validate', !this.invalid)
        this.$emit(eventName)
        return
      }
      this.$emit('valid')
    },
  },

  mounted () {
    if (this.autofocus) {
      this.focus()
    }
  },

  methods: {
    onInput ({ target: elt }) {
      if (this.isRadio) {
        return
      }

      let value = elt.value
      let dirty = value !== this.value
      if (this.isText) {
        value = String(value).trimStart()
      }

      if (this.isCheckbox) {
        value = elt.checked
        dirty = value !== this.checked
      }

      if (dirty) {
        this.$emit('input', value)
      }
    },
    onPaste (evt) {
      this.$emit('paste', evt)
    },
    onChange ({ target }) {
      if (this.isCheckbox) {
        return
      }
      this.$emit('input', target.value)
    },
    onDelete ({ target: elt }) {
      const value = elt.value
      this.$emit('delete', value)
    },
    selectSuggestion (suggestion, index) {
      this.$emit('select-suggestion', index)
    },
    focus () {
      this.$refs.input.focus()
    },
    togglePassword () {
      this.tmpType = this.tmpType === 'password' ? 'text' : 'password'
      this.eyeIcon = this.tmpType === 'password' ? 'eye' : 'eye-slash'
    },
  },
}
</script>

<style lang="postcss" scoped>
/* purgecss start ignore */
.checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 20px;
  width: 20px;
  left: 3px;
  top: 3px;
  z-index: 99;
}

.checkmark {
  position: absolute;
  top: 50%;
  left: 0.5em;
  transform: translateY(-50%);
  height: 25px;
  width: 25px;
  background-color: var(--main-form-input-bg);

  .checkbox:checked ~ & {
    background-color: var(--main-form-input-bg);
  }

  .checkbox:disabled ~ & {
    background-color: var(--main-form-input-disabled-bg);
  }

  .checkbox:focus ~ & {
    @apply outline-none ring;
  }

  &::after {
    content: "";
    position: absolute;
    display: none;
    border: solid var(--dark-blue);
    transform: rotate(45deg);
  }

  &:not(.radiomark)::after {
    border-width: 0 4px 4px 0;
    top: 4px;
    left: 8px;
    width: 9px;
    height: 14px;
  }

  /* Show the checkmark when checked */
  .checkbox:checked ~ &::after {
    display: block;
  }

  &.radiomark {
    border-radius: 50%;

    &::after {
      display: block;
      border-radius: 50%;
      border-width: 0;
      top: 7px;
      left: 7px;
      width: 8px;
      height: 8px;

      :checked ~ & {
        border-width: 6px;
      }
    }
  }
}

.checkmark-container {
  @apply relative block  py-4  pr-2  pl-10  rounded  cursor-pointer;

  margin-bottom: 12px;

  &.checked {
    background-color: var(--dark-blue);
  }
}

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

/* purgecss end ignore */
</style>
