<template>
  <div class="main">
    <h2>Lexicon</h2>
    <button @click="createNewWord">New Word</button>
    <p v-for="(word, i) in sortedWords" :key="`${word.roman}${i}`">
      <strong>{{ word.roman }}</strong> &lt; {{ word.shortHistoryFormatted }}
    </p>

    <NewWordDialog :isOpen="isNewWordDialogOpen" :resolver="newWordResolver" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import WordStage from '@/frontend/models/WordStage';
import { compare } from '@/lib/helpers';
import NewWordDialog from '@/frontend/components/NewWordDialog.vue'

@Component({ components: { NewWordDialog } })
export default class Lexicon extends Vue {
  @Prop({ type: Array, default: null }) words!: WordStage[] | null

  isNewWordDialogOpen = false
  newWordResolver: (value: unknown) => void = () => {
    // empty function
  }

  get sortedWords(): WordStage[] {
    if (this.words === null) return []
    return this.words.sort(compare(word => word.roman))
  }

  async createNewWord(): Promise<void> {
    this.isNewWordDialogOpen = true
    const newWord = await new Promise(resolve => {
      this.newWordResolver = resolve
    })
    this.isNewWordDialogOpen = false
    if (!newWord) { return }
    this.$emit('createWord', newWord)
  }
}
</script>

<style lang="scss" scoped>
.main {
  padding: 8px;
}
</style>
