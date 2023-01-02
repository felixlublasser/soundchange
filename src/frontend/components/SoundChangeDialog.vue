<template>
  <Modal v-if="helper.isOpen" v-on="{ cancel }">
    <form @click.stop @submit.prevent class="form">
      <h3>New Sound Change</h3>
      <div class="fields">
        <label for="contextBefore">Context before</label>
        <input name="contextBefore" v-model="soundChange.contextBefore"/>
        <label for="replace">Replace</label>
        <input name="replace" v-model="soundChange.replace"/>
        <label for="replaceWith">With</label>
        <input name="replaceWith" v-model="soundChange.replaceWith"/>
        <label for="contextAfter">Context after</label>
        <input name="contextAfter" v-model="soundChange.contextAfter"/>
      </div>
      <div class="buttons">
        <button @click="resolve">OK</button>
        <button @click="cancel">Cancel</button>
      </div>
    </form>
  </Modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Modal from '@/frontend/components/Modal.vue'
import SoundChange from '@/frontend/models/SoundChange';
import SoundChangeCreateInterface from '@/interface/interfaces/SoundChangeCreate'
import DialogHelper from '@/frontend/lib/DialogHelper';

function emptySoundChange() {
  return {
    contextBefore: '',
    contextAfter: '',
    replace: '',
    replaceWith: '',
  }
}

@Component({ components: { Modal } })
export default class SoundChangeDialog extends Vue {
  @Prop({ type: DialogHelper, required: true })
  helper!: DialogHelper<SoundChangeCreateInterface, SoundChange | null>

  soundChange: SoundChangeCreateInterface = { ...emptySoundChange() }

  cancel(): void {
    this.reset()
    this.helper.cancel()
  }

  resolve(): void {
    if (!this.soundChange.replace) {
      this.cancel()
    }
    this.helper.resolve(this.soundChange)
    this.reset()
  }

  reset(): void {
    this.soundChange = { ...emptySoundChange() }
  }

  mounted(): void {
    this.helper.onOpen = (initSoundChange) => {
      console.log('onOpen', initSoundChange)
      if (initSoundChange) {
        const { contextBefore, contextAfter, replace, replaceWith } = initSoundChange
        this.soundChange = { contextBefore, contextAfter, replace, replaceWith }
      } else {
        this.reset()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.fields {
  display: flex;
  flex-direction: column;
}

.buttons {
  display: flex;

}
</style>
