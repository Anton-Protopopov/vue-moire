import BaseFormField from '@/components/Base/BaseFormField.vue';

export default {
  props: ['title', 'error', 'placeholder', 'value', 'type', 'v-mask'],
  components: { BaseFormField },
  computed: {
    dataValue: {
      get() {
        return this.value;
      },
      set(value) {
        return this.$emit('input', value);
      },
    },
  },
};
