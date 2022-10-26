<template>
  <Modal v-if="isOpen" v-on="{ cancel }">
    <form @click.stop @submit.prevent>
      <h3>New Word</h3>
      <input v-model="newWordRoman"/>
      <button @click="resolve">OK</button>
      <button @click="cancel">Cancel</button>
    </form>
  </Modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Modal from '@/frontend/components/Modal.vue'

@Component({ components: { Modal } })
export default class NewWordDialog extends Vue {
  @Prop({ type: Boolean, default: false }) isOpen!: boolean
  @Prop({ type: Function, default: () => { /**/ } }) resolver!: (value: unknown) => void

  newWordRoman = ''

  cancel(): void {
    this.newWordRoman = ''
    this.resolver(null)
  }

  resolve(): void {
    if (this.newWordRoman === '') {
      this.cancel()
    }
    this.resolver(this.newWordRoman)
  }
}
</script>

<style lang="scss" scoped>
</style>
