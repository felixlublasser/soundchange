<template>
  <div class="inspector-main">
    <template v-if="languageStage">
      <h1>{{ languageStage.name }}</h1>
      <!-- <input v-model="languageStage.name"/> -->

      <h2>Sound Changes</h2>
      <input
        v-for="(key, i) in Object.keys(newSoundChange)"
        v-model="newSoundChange[key]"
        :key="'scinput' + i"
        class="sound-change-input"
      >
      <button @click="createSoundChange" :disabled="!newSoundChangeIsValid">Create sound change</button>
      <p v-for="(soundChange, i) in languageStage.soundChanges" :key="'nsc' + i">
        {{ soundChange.contextBefore }} | {{ soundChange.replace }} > {{ soundChange.replaceWith }} | {{ soundChange.contextAfter }}
      </p>

      <h2>Words</h2>
      <input v-model="newWordRoman" />
      <button @click="createWord" :disabled="newWordIsEmpty">Create Word</button>
      <p v-for="(word, i) in sortedWords" :key="'nw' + i">{{ word.roman }}</p>
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
  newSoundChange = {
    contextBefore: '',
    replace: '',
    replaceWith: '',
    contextAfter: ''
  }

  get newWordIsEmpty(): boolean {
    return this.newWordRoman === ''
  }

  get newSoundChangeIsValid(): boolean {
    return this.newSoundChange.replace !== ''
  }

  resetNewSoundChange(): void {
    this.newSoundChange = {
      contextBefore: '',
      replace: '',
      replaceWith: '',
      contextAfter: ''
    }
  }

  createWord(): void {
    if (this.languageStage === null) return
    this.languageStage.addOriginalWord({ roman: this.newWordRoman })
    this.newWordRoman = ''
  }

  createSoundChange(): void {
    if (this.languageStage === null) return
    this.languageStage.addSoundChange(this.newSoundChange)
    this.resetNewSoundChange()
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

.sound-change-input {
  width: 100px;
}
</style>