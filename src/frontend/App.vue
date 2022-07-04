<template>
  <div id="app">
    <ContextMenu />
    <component
      :is="currentView"
      v-bind="{ project }"
      @navigateTo="navigateTo"
      @loadRecentProject="loadProject"
      @createNewProject="createNewProject"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HomeView from '@/frontend/views/Home.vue';
import ProjectView from '@/frontend/views/Project.vue';
import AppView from '@/frontend/types/AppView';
import Project from '@/frontend/models/Project';
import { isSuccess } from '@/lib/result';
import ContextMenu from '@/frontend/components/ContextMenu.vue'
import endpoints from '@/frontend/lib/endpoints'

@Component({
  components: {
    HomeView,
    ProjectView,
    ContextMenu
  },
})
export default class App extends Vue {
  currentView: AppView = AppView.HOME
  project: Project | null = null

  created(): void {
    // this.createNewProject()
    // ipcRenderer.on('openedProject', (_event, project) => {
    //   this.mountProject(project)
    //   ipcRenderer.send('addToRecentProjects', project.filePath)
    // })

    // ipcRenderer.on('getProjectDataToSave', () => {
    //   this.saveProject()
    // })

    // ipcRenderer.on('getProjectDataToSaveAs', (_event, filePath) => {
    //   this.project.filePath = filePath
    //   this.saveProject()
    // })
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

  async loadProject(filePath: string): Promise<void> {
    const project = await endpoints.openProject({ filePath })
    if (isSuccess(project)) {
      this.mountProject(new Project(project))
    }
  }

  mountProject(project: Project): void {
    this.project = project
    this.navigateTo(AppView.PROJECT)
  }

  saveProject(): void {
    // TODO: fix
    // if (!this.project.filePath) {
    //   throw new Error('A project without a file path cannot be saved')
    // } else {
    //   ipcRenderer.send('saveProject', Store.fromProject(this.project), this.project.filePath)
    // }
  }
}
</script>

<style lang="scss">
html, body {
  height: 100%;
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
  height: 100%;
  color: #eee;
}
</style>
