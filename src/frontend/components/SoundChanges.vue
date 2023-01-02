<template>
  <div class="main">
    <h2>Sound Changes</h2>
    <button @click="createNewSoundChange">New Sound Change</button>
    <ul v-if="soundChanges">
      <li
        v-for="(sc, i) in soundChanges" :key="'nsc' + i"
        @contextmenu="openContextMenu($event, sc)"
      >
        {{ sc.contextBefore }} | {{ sc.replace }} > {{ sc.replaceWith }} | {{ sc.contextAfter }}
      </li>
    </ul>

    <SoundChangeDialog
      :helper="soundChangeDialogHelper"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import SoundChange from '@/frontend/models/SoundChange';
import SoundChangeDialog from '@/frontend/components/SoundChangeDialog.vue'
import EventBus from '@/lib/EventBus';
import SoundChangeCreateInterface from '@/interface/interfaces/SoundChangeCreate';
import DialogHelper from '@/frontend/lib/DialogHelper'

@Component({ components: { SoundChangeDialog } })
export default class SoundChanges extends Vue {
  @Prop({ type: Array, default: null }) soundChanges!: SoundChange[] | null

  soundChangeDialogHelper = new DialogHelper<SoundChangeCreateInterface, SoundChange | null>()

  async createNewSoundChange(): Promise<void> {
    const newSoundChange = await this.soundChangeDialogHelper.openAndAwait(null)
    if (!newSoundChange) { return }
    console.log('emit createSoundChange', newSoundChange)
    this.$emit('createSoundChange', newSoundChange)
  }

  openContextMenu(event: MouseEvent, soundChange: SoundChange): void {
    console.log('selected sc', soundChange)
    EventBus.$emit('openContextMenu', [
      {
        label: 'Edit',
        onClick: async (): Promise<void> => {
          const editedSoundChange = await this.soundChangeDialogHelper.openAndAwait(soundChange)
          if (!editedSoundChange) { return }
          this.$emit('updateSoundChange', soundChange.id, editedSoundChange)
        },
      },
      {
        label: 'Delete',
        onClick: () => {
          this.$emit('deleteSoundChange', soundChange.id)
        }
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