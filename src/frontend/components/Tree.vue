<template>
  <div class="tree-main">
    <TreeLanguageStage
      v-bind="{
        languageStage: protoLanguage,
        selectedLanguageStage
      }"
      @select="select"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import LanguageStage from '@/models/LanguageStage';
import TreeLanguageStage from '@/components/TreeLanguageStage.vue'

@Component({ components: { TreeLanguageStage }})
export default class Tree extends Vue {
  @Prop({ type: LanguageStage, required: true }) protoLanguage!: LanguageStage
  @Prop({ type: LanguageStage, default: null }) selectedLanguageStage!: LanguageStage | null

  isSelected(ls: LanguageStage): boolean {
    return ls === this.selectedLanguageStage
  }

  select(ls: LanguageStage = this.protoLanguage): void {
    this.$emit('select', ls)
  }
}
</script>

<style lang="scss" scoped>
.tree-main {
  background-color: #333;
  display: flex;
  justify-content: center;
  padding: 16px;
}
</style>