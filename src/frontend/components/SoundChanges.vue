<template>
  <div class="main">
    <h2>Sound Changes</h2>
    <button @click="createNewSoundChange">New Sound Change</button>
    <ul v-if="soundChanges">
      <li v-for="(sc, i) in soundChanges" :key="'nsc' + i">
        {{ sc.contextBefore }} | {{ sc.replace }} > {{ sc.replaceWith }} | {{ sc.contextAfter }}
      </li>
    </ul>

    <NewSoundChangeDialog
      :isOpen="isNewSoundChangeDialogOpen"
      :resolver="newSoundChangeResolver"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import SoundChange from '@/frontend/models/SoundChange';
import NewSoundChangeDialog from '@/frontend/components/NewSoundChangeDialog.vue'

@Component({ components: { NewSoundChangeDialog } })
export default class SoundChanges extends Vue {
  @Prop({ type: Array, default: null }) soundChanges!: SoundChange[] | null

  isNewSoundChangeDialogOpen = false
  newSoundChangeResolver: (value: unknown) => void = () => {
    // empty function
  }

  async createNewSoundChange(): Promise<void> {
    this.isNewSoundChangeDialogOpen = true
    const newSoundChange = await new Promise(resolve => {
      this.newSoundChangeResolver = resolve
    })
    this.isNewSoundChangeDialogOpen = false
    if (!newSoundChange) { return }
    this.$emit('createSoundChange', newSoundChange)
  }

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