<template>
  <div class="project-main">
   <Tree v-bind="{
      languageTree: project.languageTree,
      selectedLanguageStageId: selectedLanguageStage && selectedLanguageStage.id
    }" class="tree" @select="select"/>
    <Inspector
      :languageStage="selectedLanguageStage"
      @updateLanguageStage="updateLanguageStage"
      class="inspector"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Project from '@/frontend/models/Project'
import LanguageStage from '@/frontend/models/LanguageStage'
import Inspector from '@/frontend/components/Inspector.vue'
import Tree from '@/frontend/components/Tree.vue'
import endpoints from '@/frontend/lib/endpoints'
import { isError } from '@/lib/result'

@Component({ components: { Inspector, Tree } })
export default class ProjectView extends Vue {
  @Prop({ type: Project, required: true }) project!: Project
  
  selectedLanguageStage: LanguageStage | null = null

  async select(lsId: string): Promise<void> {
    console.log('gasvaersdlfn')
    const ls = await endpoints.getLanguageStage({ projectId: this.project.id, id: lsId })
    console.log('got ls', JSON.stringify(ls))
    if (isError(ls)) { return }
    console.log(JSON.stringify(ls))
    this.selectedLanguageStage = new LanguageStage(ls)
  }

  async updateLanguageStage(): Promise<void> {
    if (!this.selectedLanguageStage) { return }
    const updatedLanguageStage = await endpoints.updateLanguageStage({
      projectId: this.project.id,
      id: this.selectedLanguageStage.id,
      params: this.selectedLanguageStage.dataChanged,
    })
    if (isError(updatedLanguageStage)) { return }
    // console.log(JSON.stringify(updatedLanguageStage))
    this.selectedLanguageStage = new LanguageStage(updatedLanguageStage)
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