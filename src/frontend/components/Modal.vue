<template>
  <div class="overlay" @click="$emit('cancel')">
    <div @click.stop class="modal">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Modal extends Vue {
}
</script>

<style lang="scss" scoped>
.overlay {
  position: absolute;
  block-size: 100%;
  inline-size: 100%;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  inset-inline-start: 0;
  inset-block-start: 0;
}

.modal {
  border: 1px solid black;
  padding: 8px;
}
</style>
