<template>
  <div class="inspector-main">
    <template v-if="languageStage">
      <div class="header">
        <input v-model="name" @blur="updateLanguageStage" class="input-h1"/>
      </div>

      <div class="divided">
        <!-- <div class="half words">
          <h2>Words</h2>
          <input v-model="newWordRoman" />
          <button @click="createWord" :disabled="newWordIsEmpty">Create Word</button>
          <p v-for="(word, i) in sortedWords" :key="'nw' + i">{{ word.shortHistory }}</p>
        </div> -->

        <!-- <div class="half sound-changes">
          <h2>Sound Changes</h2>
          <input
            v-for="(key, i) in Object.keys(newSoundChange)"
            v-model="newSoundChange[key]"
            :key="'scinput' + i"
            class="sound-change-input"
          >
          <button @click="createSoundChange" :disabled="!newSoundChangeIsValid">Create Sound Change</button>
          <p v-for="(soundChange, i) in languageStage.soundChanges" :key="'nsc' + i">
            {{ soundChange.contextBefore }} | {{ soundChange.replace }} > {{ soundChange.replaceWith }} | {{ soundChange.contextAfter }}
          </p>
        </div> -->
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import LanguageStage from '@/frontend/models/LanguageStage';
// import Word from '@/frontend/types/Word';
// import { compare } from '@/lib/helpers';

@Component({})
export default class Inspector extends Vue {
  @Prop({ type: LanguageStage, default: null }) languageStage!: LanguageStage | null

  get name(): string | null {
    return this.languageStage ? this.languageStage.name : null
  }

  set name(value: string | null) {
    if (!this.languageStage) { return }
    this.languageStage.name = value
  }

  updateLanguageStage(): void {
    this.$emit('updateLanguageStage')
  }

  // newWordRoman = '';
  // newSoundChange = {
  //   contextBefore: '',
  //   replace: '',
  //   replaceWith: '',
  //   contextAfter: ''
  // }

  // get newWordIsEmpty(): boolean {
  //   return this.newWordRoman === ''
  // }

  // get newSoundChangeIsValid(): boolean {
  //   return this.newSoundChange.replace !== ''
  // }

  // resetNewSoundChange(): void {
  //   this.newSoundChange = {
  //     contextBefore: '',
  //     replace: '',
  //     replaceWith: '',
  //     contextAfter: ''
  //   }
  // }

  // createWord(): void {
    // if (this.languageStage === null) return
    // this.languageStage.addOriginalWord({ roman: this.newWordRoman })
    // this.newWordRoman = ''
  // }

  // createSoundChange(): void {
    // if (this.languageStage === null) return
    // this.languageStage.addSoundChange(this.newSoundChange)
    // this.resetNewSoundChange()
  // }

  // get sortedWords(): Word[] {
  //   if (this.languageStage === null) return []
  //   return this.languageStage.allWords.sort(compare(word => word.roman))
  // }
}
</script>

<style lang="scss" scoped>
.inspector-main {
  background-color: #555;
  display: flex;
  flex-direction: column;
}

.header {
  width: 100%;
  border-bottom: 1px solid #000;
  padding: 16px;
}

.input-h1 {
  font-size: 1.5em;
  font-weight: bold;
  background-color: transparent;
  border: none;
}

.half {
  padding: 16px;
}

.words {
  flex-grow: 1;
  border-right: 1px solid #000;
}

.sound-changes {
  flex-grow: 2;
}

.sound-change-input {
  width: 70px;
}

.divided {
  display: flex;
  flex-grow: 1;
}
</style>