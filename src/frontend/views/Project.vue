<template>
  <div class="project-main">
   <Tree v-bind="{
      languageTree: project.languageTree,
      selectedLanguageStageId: selectedLanguageStage && selectedLanguageStage.id
    }" class="tree" @select="select"/>
    <Inspector
      :languageStage="selectedLanguageStage"
      :projectId="project.id"
      @updateLanguageStage="updateLanguageStage"
      ref="inspector"
      class="inspector"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Project from '@/frontend/models/Project'
import LanguageStage from '@/frontend/models/LanguageStage'
import Inspector from '@/frontend/components/LanguageInspector.vue'
import Tree from '@/frontend/components/Tree.vue'
import endpoints from '@/frontend/lib/endpoints'
import { isError } from '@/lib/result'

@Component({ components: { Inspector, Tree } })
export default class ProjectView extends Vue {
  @Prop({ type: Project, required: true }) project!: Project
  
  xxSelectedLanguageStage: LanguageStage | null = null

  get selectedLanguageStage (): LanguageStage | null {
    return this.xxSelectedLanguageStage
  }

  set selectedLanguageStage (languageStage: LanguageStage | null) {
    this.xxSelectedLanguageStage = languageStage
    const inspector = this.$refs.inspector as Inspector
    this.$nextTick(() => inspector.update())
  }

  async select(lsId: string): Promise<void> {
    if (this.selectedLanguageStage && lsId === this.selectedLanguageStage.id) {
      return
    }
    const ls = await endpoints.getLanguageStage({ projectId: this.project.id, id: lsId })
    if (isError(ls)) { return }
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
    this.selectedLanguageStage = new LanguageStage(updatedLanguageStage)
    this.$emit('updateProject')
  }
}
</script>

<style lang="scss" scoped>
.project-main {
  display: flex;
  block-size: 100%;
}

.tree {
  inline-size: 25%;
}

.inspector {
  inline-size: 75%;
}
</style>