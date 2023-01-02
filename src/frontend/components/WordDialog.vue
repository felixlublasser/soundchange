<template>
  <Modal v-if="helper.isOpen && word" v-on="{ cancel }">
    <form @click.stop @submit.prevent>
      <h3>New Word</h3>
      <input v-model="word.roman"/>
      <button @click="resolve">OK</button>
      <button @click="cancel">Cancel</button>
    </form>
  </Modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Modal from '@/frontend/components/Modal.vue'
import WordStage from '@/frontend/models/WordStage';
import WordStageCreateInterface from '@/interface/interfaces/WordStageCreate'
import DialogHelper from '@/frontend/lib/DialogHelper';

@Component({ components: { Modal } })
export default class WordDialog extends Vue {
  @Prop({ type: DialogHelper, required: true })
  helper!: DialogHelper<WordStageCreateInterface, WordStage | null>

  word: WordStageCreateInterface | null = null

  cancel(): void {
    this.word = { roman: '' }
    this.helper.cancel()
  }

  resolve(): void {
    if (!this.word || this.word.roman === '') {
      this.cancel()
    }
    this.helper.resolve(this.word)
  }

  mounted(): void {
    this.helper.onOpen = (initWord) => {
      if (initWord) {
        this.word = { roman: initWord.roman }
      } else {
        this.word = { roman: '' }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
