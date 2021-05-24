<template>
  <div id="app">
    <ContextMenu />
    <component
      :is="currentView"
      v-bind="{ project }"
      @navigateTo="navigateTo"
      @loadRecentProject="loadProject"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HomeView from '@/views/Home.vue';
import ProjectView from '@/views/Project.vue';
import AppView from '@/models/AppView';
import Project from '@/models/Project';
import { ipcRenderer } from 'electron';
import { isSuccess, throwUnless } from './lib/result';
import Store from '@/records/Store'
import ContextMenu from '@/components/ContextMenu.vue'

@Component({
  components: {
    HomeView,
    ProjectView,
    ContextMenu
  },
})
export default class App extends Vue {
  currentView: AppView = AppView.HOME
  project: Project = new Project()

  created(): void {
    ipcRenderer.on('openedProject', (_event, json, filePath) => {
      this.mountProject(json, filePath)
      ipcRenderer.send('addToRecentProjects', filePath)
    })

    ipcRenderer.on('getProjectDataToSave', () => {
      this.saveProject()
    })

    ipcRenderer.on('getProjectDataToSaveAs', (_event, filePath) => {
      this.project.filePath = filePath
      this.saveProject()
    })
  }

  navigateTo(view: AppView): void {
    this.currentView = view
  }

  async loadProject(filePath: string): Promise<void> {
    const json = await ipcRenderer.invoke('loadProject', filePath)
    this.mountProject(json, filePath)
  }

  mountProject(json: unknown, filePath: string): void {
    const store = throwUnless(Store.fromJSON(json))
    const loadResult = Project.fromStore(store, filePath)
    if (isSuccess(loadResult)) {
      this.project = loadResult
    } else {
      throw loadResult
    }
    this.navigateTo(AppView.PROJECT)
  }

  saveProject(): void {
    if (!this.project.filePath) {
      throw new Error('A project without a file path cannot be saved')
    } else {
      ipcRenderer.send('saveProject', Store.fromProject(this.project), this.project.filePath)
    }
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
