<template>
  <div class="tree-main">
    <SubTree
      v-bind="{
        languageBranch: languageTree,
        selectedLanguageStageId
      }"
      @select="select"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import LanguageBranch from '@/frontend/models/LanguageBranch';
import SubTree from '@/frontend/components/SubTree.vue'

@Component({ components: { SubTree }})
export default class Tree extends Vue {
  @Prop({ type: LanguageBranch, required: true }) languageTree!: LanguageBranch
  @Prop({ type: String, default: null }) selectedLanguageStageId!: string | null

  select(languageStageId: string): void {
    this.$emit('select', languageStageId)
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