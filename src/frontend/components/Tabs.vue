<template>
  <div>
    <ul class="top-bar">
      <li
        v-for="tab in tabs"
        :key="tab.key"
        @click="activateTab(tab)"
        class="tab"
        :class="{'tab--active': isActive(tab)}"
      >
        {{ tab.title }}
      </li>
    </ul>
    <slot :name="activeTabKey" class="slot"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import ITab from '@/frontend/types/ITab'

@Component
export default class Tabs extends Vue {
  @Prop({ type: Array, required: true }) tabs!: ITab[]
  @Prop({ type: String, required: true }) activeTabKey!: string

  isActive(tab: ITab): boolean {
    return this.activeTabKey === tab.key
  }

  activateTab(tab: ITab): void {
    if (this.activeTabKey === tab.key) {
      return
    }
    this.$emit('activateTab', tab.key)
  }
}
</script>

<style lang="scss" scoped>
.top-bar {
  block-size: 24px;
  inline-size: 100%;
  display: flex;
  border-block-end: 1px solid black;
}

.tab {
  padding-inline: 8px;
  border-inline-end: 1px solid black;
  border-block-start: 1px solid black;
  border-start-end-radius: 4px;
  background-color: #555;
  cursor: pointer;

  &--active {
    background-color: #ddd;
    color: black;
  }
}
</style>
