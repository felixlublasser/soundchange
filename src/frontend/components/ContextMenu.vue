<template>
  <div
    v-if="menuItems !== null"
    @click.prevent="close()"
    class="overlay"
  >
    <div
      class="context-menu-main"
      :style="`inset-block-start:${position.insetBlockStart}px;inset-inline-start:${position.insetInlineStart}px;`"
    >
      <div
        v-for="(menuItem, i) in menuItems"
        :key="i"
        @click.stop="callMenuItem(menuItem)"
        class="menu-item"
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
  name: string;
  onClick(): void;
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

  &:hover {
    background-color: #aaa;
    color: black;
  }
}
</style>
