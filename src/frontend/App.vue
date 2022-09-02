<template>
  <div id="app">
    <ContextMenu />
    <component
      :is="currentView"
      :project="activeProject"
      @navigateTo="navigateTo"
      @loadRecentProject="loadProject"
      @createNewProject="createNewProject"
      @updateProject="updateOpenProject(activeProjectId)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HomeView from '@/frontend/views/Home.vue';
import ProjectView from '@/frontend/views/Project.vue';
import AppView from '@/frontend/types/AppView';
import Project from '@/frontend/models/Project';
import { isSuccess, succeedOrThrow } from '@/lib/result';
import ContextMenu from '@/frontend/components/ContextMenu.vue'
import endpoints from '@/frontend/lib/endpoints'
import { ipcRenderer } from 'electron';

@Component({
  components: {
    HomeView,
    ProjectView,
    ContextMenu
  },
})
export default class App extends Vue {
  currentView: AppView = AppView.HOME
  openProjects: { [index: string]: Project } = {}
  activeProjectId: string | null = null

  created(): void {
    // this.createNewProject()
    // ipcRenderer.on('openedProject', (_event, project) => {
    //   this.mountProject(project)
    //   ipcRenderer.send('addToRecentProjects', project.filePath)
    // })

    ipcRenderer.on('save', () => {
      this.saveProject()
    })

    // ipcRenderer.on('getProjectDataToSaveAs', (_event, filePath) => {
    //   this.project.filePath = filePath
    //   this.saveProject()
    // })
  }

  // get firstProject(): Project | undefined {
  //   return this.openProjects[Object.keys(this.openProjects)[0]]
  // }

  get activeProject (): Project | null {
    return this.activeProjectId
      ? this.openProjects[this.activeProjectId]
      : null
  }

  async createNewProject(): Promise<void> {
    const project = await endpoints.newProject()
    if (isSuccess(project)) {
      this.mountProject(new Project(project))
    }
  }

  navigateTo(view: AppView): void {
    this.currentView = view
  }

  async updateOpenProject(projectId: string): Promise<void> {
    const project = await endpoints.getProject({ id: projectId })
    if (isSuccess(project)) {
      this.mountProject(new Project(project))
    }
  }

  async loadProject(filePath: string): Promise<void> {
    const project = await endpoints.openProject({ filePath })
    if (isSuccess(project)) {
      this.mountProject(new Project(project))
    }
  }

  mountProject(project: Project): void {
    this.$set(this.openProjects, project.id, project)
    this.activeProjectId = project.id
    this.navigateTo(AppView.PROJECT)
  }

  async saveProject(): Promise<void> {
    if (!this.activeProject || !this.activeProjectId) {
      return
    }
    if (!this.activeProject.filePath) {
      throw new Error('A project without a file path cannot be saved.')
    }
    const project = succeedOrThrow(
      await endpoints.saveProject({ id: this.activeProjectId })
    )
    this.mountProject(new Project(project))
  }
}
</script>

<style lang="scss">
html, body {
  block-size: 100%;
  margin: 0;
}

* {
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #111;
  block-size: 100%;
  color: #eee;
}
</style>
