<template>
  <div class="main">
    <h2>Lexicon</h2>
    <button @click="createNewWord">New Word</button>
    <p
      v-for="(word, i) in sortedWords"
      :key="`${word.roman}${i}`"
      @contextmenu="openContextMenu($event, word)"
    >
      <strong>{{ word.roman }}</strong> &lt; {{ word.shortHistoryFormatted }}
    </p>

    <WordDialog
      :helper="wordDialogHelper"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import WordStage from '@/frontend/models/WordStage';
import { compare } from '@/lib/helpers';
import WordDialog from '@/frontend/components/WordDialog.vue'
import EventBus from '@/lib/EventBus';
import WordStageCreateInterface from '@/interface/interfaces/WordStageCreate';
import DialogHelper from '@/frontend/lib/DialogHelper';

@Component({ components: { WordDialog } })
export default class Lexicon extends Vue {
  @Prop({ type: Array, default: null }) words!: WordStage[] | null

  wordDialogHelper = new DialogHelper<WordStageCreateInterface, WordStage | null>()
  
  get sortedWords(): WordStage[] {
    if (this.words === null) return []
    return this.words.sort(compare(word => word.roman))
  }

  async createNewWord(): Promise<void> {
    const newWord = await this.wordDialogHelper.openAndAwait(null)
    if (!newWord) { return }
    this.$emit('createWord', newWord)
  }

  openContextMenu(event: MouseEvent, word: WordStage): void {
    EventBus.$emit('openContextMenu', [
      {
        label: 'Edit',
        onClick: async (): Promise<void> => {
          const editedWord = await this.wordDialogHelper.openAndAwait(word)
          if (!editedWord) { return }
          this.$emit('updateWord', word.originalWordId, editedWord)
        },
        disabled: word.isInherited
      },
      {
        label: 'Delete',
        onClick: () => {
          this.$emit('deleteWord', word.originalWordId)
        },
        disabled: word.isInherited
      }
    ], { insetBlockStart: event.clientY, insetInlineStart: event.clientX })
  }
}
</script>

<style lang="scss" scoped>
.main {
  padding: 8px;
}
</style>
