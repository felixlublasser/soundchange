<template>
  <div class="inspector-main">
    <template v-if="languageStage">
      <label>Language Name</label>
      <input v-model="languageStage.name"/>
      <h2>Words</h2>
      <input v-model="newWordRoman" />
      <button @click="createWord" :disabled="newWordIsEmpty">Create Word</button>
      <p v-for="(word, i) in sortedWords" :key="i">{{ word.roman }}</p>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import LanguageStage from '@/models/LanguageStage';
import Word from '@/models/Word';
import { compare } from '@/lib/helpers';

@Component({})
export default class Inspector extends Vue {
  @Prop({ type: LanguageStage, default: null }) languageStage!: LanguageStage | null

  newWordRoman = '';

  get newWordIsEmpty(): boolean {
    return this.newWordRoman === ''
  }

  createWord(): void {
    if (this.languageStage === null) return
    this.languageStage.addOriginalWord({ roman: this.newWordRoman })
    this.newWordRoman = ''
  }

  get sortedWords(): Word[] {
    if (this.languageStage === null) return []
    return this.languageStage.allWords.sort(compare(word => word.roman))
  }
}
</script>

<style lang="scss" scoped>
.inspector-main {
  background-color: #555;
  padding: 16px;
}
</style>