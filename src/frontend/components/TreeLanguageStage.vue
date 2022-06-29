<template>
  <div class="treelangstage-wrapper" ref="wrapper">
    <div
      @click.prevent="$emit('select', languageStage)"
      @contextmenu="openContextMenu"
      class="treelangstage-main"
      :class="{ selected: isSelected }"
    >
      <span>
        {{ languageStage.name }}
      </span>
    </div>
    <div class="treelangstage-branches">
      <TreeLanguageStage
        v-for="(branch, i) in languageStage.branches" :key="i"
        v-bind="{
          languageStage: branch,
          selectedLanguageStage
        }"
        v-on="$listeners"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import LanguageStage from '@/models/LanguageStage';
import EventBus from '@/lib/EventBus';

@Component
export default class TreeLanguageStage extends Vue {
  @Prop({ type: LanguageStage, required: true }) languageStage!: LanguageStage
  @Prop({ type: LanguageStage, default: null }) selectedLanguageStage!: LanguageStage | null

  get isSelected(): boolean {
    return this.languageStage === this.selectedLanguageStage
  }

  openContextMenu(event: MouseEvent): void {
    console.log('event', event)
    EventBus.$emit('openContextMenu', [
      {
        label: 'Create branch',
        onClick: (): void => {
          const branch = this.languageStage.addBranch()
          this.$emit('select', branch)
        }
      },
      {
        label: 'Delete',
        onClick() {
          //TODO
        }
      }
    ], { top: event.clientY, left: event.clientX })
  }
}
</script>

<style lang="scss" scoped>
.treelangstage {
  &-main {
    border-radius: 4px;
    cursor: pointer;
    margin-inline: 16px;
    background-color: #333;
    border: 1px solid #888;
    display: flex;
    min-width: 8px;
    min-height: 8px;
  }

  &-wrapper {
    display: flex;
    flex-direction: column;
    height: min-content;
  }

  &-branches {
    display: flex;
  }
}

.selected {
  background-color: #ddd;
  color: black;
}
</style>