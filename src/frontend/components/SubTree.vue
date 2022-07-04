<template>
  <div class="treelangstage-wrapper" ref="wrapper">
    <div
      @click.prevent="$emit('select', languageBranch.id)"
      @contextmenu="openContextMenu"
      class="treelangstage-main"
      :class="{ selected: isSelected }"
    >
      <span>
        {{ languageBranch.name }}
      </span>
      <template v-if="languageBranch.branches.length">
        <span v-if="isExpanded" @click="collapse">-</span>
        <span v-else @click="expand">+</span>
      </template>
    </div>
    <div v-if="isExpanded" class="treelangstage-branches">
      <SubTree
        v-for="(branch, i) in languageBranch.branches" :key="i"
        v-bind="{
          languageBranch: branch,
          selectedLanguageStageId
        }"
        v-on="$listeners"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import LanguageBranch from '@/frontend/models/LanguageBranch';
import EventBus from '@/lib/EventBus';

@Component
export default class SubTree extends Vue {
  @Prop({ type: LanguageBranch, required: true }) languageBranch!: LanguageBranch
  @Prop({ type: String, default: null }) selectedLanguageStageId!: string | null

  isExpanded = false

  get isSelected(): boolean {
    return this.languageBranch.id === this.selectedLanguageStageId
  }

  expand(): void {
    this.isExpanded = true
  }

  collapse(): void {
    this.isExpanded = false
  }

  openContextMenu(event: MouseEvent): void {
    EventBus.$emit('openContextMenu', [
      {
        label: 'Create branch',
        onClick: (): void => {
          // const branch = this.languageStage.addBranch()
          // this.$emit('select', branch)
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