<template>
  <div
    v-if="menuItems !== null"
    @click.prevent="close()"
    class="overlay"
  >
    <div
      class="context-menu-main"
      :style="`inset-block-start:${position.insetBlockStart + 1}px;inset-inline-start:${position.insetInlineStart + 1}px;`"
    >
      <div
        v-for="(menuItem, i) in menuItems"
        :key="i"
        @click.stop="callMenuItem(menuItem)"
        class="menu-item"
        :class="menuItem.disabled ? 'menu-item--disabled': 'menu-item--enabled'"
      >
        {{ menuItem.label }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import EventBus from '@/lib/EventBus'
import ScreenPosition from '@/frontend/types/ScreenPosition';

interface MenuItem {
  label: string;
  onClick(): void;
  disabled: boolean;
}

@Component
export default class ContextMenu extends Vue {
  menuItems: MenuItem[] | null = null
  position: ScreenPosition | null = null

  created(): void {
    EventBus.$on(
      'openContextMenu',
      (menuItems: MenuItem[], position: ScreenPosition) => {
        console.log('postion', position)
        this.menuItems = menuItems
        this.position = position
      }
    )

    EventBus.$on('closeContextMenu', () => {
      this.close()
    })
  }

  close(): void {
    this.menuItems = null
    this.position = null
  }

  callMenuItem(menuItem: MenuItem): void {
    if (menuItem.disabled) { return }
    menuItem.onClick()
    this.close()
  }
}
</script>

<style lang="scss">
.overlay {
  position: absolute;
  inset-inline-start: 0;
  inset-block-start: 0;
  width: 100vw;
  height: 100vh;
  background-color: transparent;
}

.context-menu-main {
  position: absolute;
  border: 1px solid #888;
  border-radius: 4px;
  background-color: #111;
  cursor: pointer;
}

.menu-item {
  padding: 4px;
  
  &:not(:last-child) {
    border-block-end: 1px solid #888;
  }

  &--enabled:hover {
    background-color: #aaa;
    color: black;
  }

  &--disabled {
    color: #aaa
  }
}
</style>
