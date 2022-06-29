<template>
  <div class="project-main">
    <Tree v-bind="{
      protoLanguage: project.protoLanguage,
      selectedLanguageStage
    }" class="tree" @select="select"/>
    <Inspector :languageStage="selectedLanguageStage" class="inspector" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Project from '@/frontend/models/Project'
import LanguageStage from '@/frontend/models/LanguageStage'
import Inspector from '@/components/Inspector.vue'
import Tree from '@/components/Tree.vue'

@Component({ components: { Inspector, Tree } })
export default class ProjectView extends Vue {
  @Prop({ type: Project, required: true }) project!: Project
  
  selectedLanguageStage: LanguageStage | null = null

  select(ls: LanguageStage): void {
    this.selectedLanguageStage = ls
  }
}
</script>

<style lang="scss" scoped>
.project-main {
  display: flex;
  height: 100%;
}

.tree {
  width: 25%;
}

.inspector {
  width: 75%;
}
</style>