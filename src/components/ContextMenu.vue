<template>
  <div
    v-if="menuItems !== null"
    class="context-menu-main"
    :style="`top:${position.y};left:${position.x}`"
  >
    <div
      v-for="(menuItem, i) in menuItems"
      :key="i"
      @click="callMenuItem(menuItem)"
      class="menu-item"
    >
      {{ menuItem.label }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import EventBus from '@/lib/EventBus'

interface MenuItem {
  name: string;
  onClick(): void;
}

@Component
export default class ContextMenu extends Vue {
  menuItems: MenuItem[] | null = null
  position: { x: number, y: number } | null = null

  created(): void {
    EventBus.$on('openContextMenu', (menuItems: MenuItem[], position: { x: number, y: number }) => {
      this.menuItems = menuItems
      this.position = position
    })

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
    border-bottom: 1px solid #888;
  }

  &:hover {
    background-color: #aaa;
    color: black;
  }
}
</style>
