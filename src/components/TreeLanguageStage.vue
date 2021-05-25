<template>
  <div class="treelangstage-wrapper" ref="wrapper">
    <div
      class="treelangstage-main"
      :class="{ selected: isSelected }"
    >
      <span @click="$emit('select', languageStage)">
        {{ languageStage.name }}
      </span>
      <button class="menu-button" @click="openContextMenu">
        &#9660;
      </button>
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
import ScreenPosition from '@/types/ScreenPosition'

@Component
export default class TreeLanguageStage extends Vue {
  @Prop({ type: LanguageStage, required: true }) languageStage!: LanguageStage
  @Prop({ type: LanguageStage, default: null }) selectedLanguageStage!: LanguageStage | null

  get isSelected(): boolean {
    return this.languageStage === this.selectedLanguageStage
  }

  getBottomLeftCorner(): ScreenPosition {
    const rect = (this.$refs.wrapper as HTMLElement).getBoundingClientRect()
    return {
      top: rect.top + rect.height,
      left: rect.left
    }
  }

  openContextMenu(): void {
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
        click() {
          //TODO
        }
      }
    ], this.getBottomLeftCorner())
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

    &> span {
      padding: 4px;

      &:hover {
        background-color: #888;
        color: black;
      }
    }

    &:hover {
      margin-right: 0;

      &> .menu-button {
        display: block;
        width: 16px;
        padding: 0;
        background-color: #333;
        color: unset;
        border: none;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        cursor: pointer;
        font-size: 11px;
        padding-top: 1px;

        &:hover {
          background-color: #888;
          color: black;
        }
      }
    }
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

  &> .menu-button {
    background-color: #ddd;
    color: black;
  }
}

.menu-button {
  display: none;
}
</style>