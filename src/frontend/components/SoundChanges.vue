<template>
  <div class="main">
    <h2>Sound Changes</h2>
    <!-- <input
      v-for="(key, i) in Object.keys(newSoundChange)"
      v-model="newSoundChange[key]"
      :key="'scinput' + i"
      class="sound-change-input"
    >
    <button @click="createSoundChange" :disabled="!newSoundChangeIsValid">Create Sound Change</button> -->
    <ul v-if="soundChanges">
      <li v-for="(soundChange, i) in soundChanges" :key="'nsc' + i">
        {{ soundChange.contextBefore }} | {{ soundChange.replace }} > {{ soundChange.replaceWith }} | {{ soundChange.contextAfter }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import SoundChange from '@/frontend/models/SoundChange';

@Component
export default class SoundChanges extends Vue {
  @Prop({ type: Array, default: null }) soundChanges!: SoundChange[] | null

  // newSoundChange = {
  //   contextBefore: '',
  //   replace: '',
  //   replaceWith: '',
  //   contextAfter: ''
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

  // createSoundChange(): void {
    // if (this.languageStage === null) return
    // this.languageStage.addSoundChange(this.newSoundChange)
    // this.resetNewSoundChange()
  // }
}
</script>

<style lang="scss" scoped>
.main {
  padding: 8px;
}
</style>