<template>
  <div v-if="isOpen" class="overlay" @click="cancel">
    <div class="modal" @click.stop>
      <h3>New Word</h3>
      <input v-model="newWordRoman"/>
      <button @click="resolve">OK</button>
      <button @click="cancel">Cancel</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import NewWordDialog from '@/frontend/components/NewWordDialog.vue'

@Component({ components: { NewWordDialog } })
export default class Lexicon extends Vue {
  @Prop({ type: Boolean, default: false }) isOpen!: boolean
  @Prop({ type: Function, default: () => { /**/ } }) resolver!: (value: unknown) => void

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

  newWordRoman = ''
}
</script>

<style lang="scss" scoped>
.overlay {
  position: absolute;
  block-size: 100%;
  inline-size: 100%;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  inset-inline-start: 0;
  inset-block-start: 0;
}

.modal {
  border: 1px solid black;
  padding: 8px;
}
</style>
