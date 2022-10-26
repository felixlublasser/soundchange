<template>
  <Modal v-if="isOpen" v-on="{ cancel }">
    <form @click.stop @submit.prevent class="form">
      <h3>New Sound Change</h3>
      <div class="fields">
        <label for="contextBefore">Context before</label>
        <input name="contextBefore" v-model="newSoundChange.contextBefore"/>
        <label for="replace">Replace</label>
        <input name="replace" v-model="newSoundChange.replace"/>
        <label for="replaceWith">With</label>
        <input name="replaceWith" v-model="newSoundChange.replaceWith"/>
        <label for="contextAfter">Context after</label>
        <input name="contextAfter" v-model="newSoundChange.contextAfter"/>
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

function initSoundChange() {
  return {
    contextBefore: '',
    contextAfter: '',
    replace: '',
    replaceWith: '',
  }
}

@Component({ components: { Modal } })
export default class NewSoundChangeDialog extends Vue {
  @Prop({ type: Boolean, default: false }) isOpen!: boolean
  @Prop({ type: Function, default: () => { /**/ } }) resolver!: (value: unknown) => void

  newSoundChange = { ...initSoundChange() }

  cancel(): void {
    this.newSoundChange = { ...initSoundChange() }
    this.resolver(null)
  }

  resolve(): void {
    if (!this.newSoundChange.replace) {
      this.cancel()
    }
    this.resolver(this.newSoundChange)
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
