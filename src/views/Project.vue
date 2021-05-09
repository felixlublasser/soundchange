<template>
  <div class="project-main">
    <Tree :protoLanguage="project.protoLanguage" class="tree" />
    <Inspector :languageStage="selectedLanguageStage" class="inspector" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Project from '@/models/Project'
import LanguageStage from '@/models/LanguageStage'
import Inspector from '@/components/Inspector.vue'
import Tree from '@/components/Tree.vue'

@Component({ components: { Inspector, Tree } })
export default class ProjectView extends Vue {
  @Prop({ type: Project, required: true }) project!: Project
  
  selectedLanguageStage: LanguageStage | null = null
}
</script>

<style lang="scss" scoped>
.project-main {
  display: flex;
}

.tree {
  width: 25%;
}

.inspector {
  width: 75%;
}
</style>