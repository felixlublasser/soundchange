import LanguageTreeBranch from '@/frontend/models/LanguageBranch'
import ProjectInterface from '@/interface/interfaces/Project'

export default class Project {
  private data: ProjectInterface

  constructor(data: ProjectInterface) {
    this.data = data
  }

  get id(): string {
    return this.data.id
  }

  get version(): string {
    return this.data.version
  }

  get filePath(): string | null {
    return this.data.filePath
  }

  get languageTree(): LanguageTreeBranch {
    return new LanguageTreeBranch(this.data.languageTree)
  }
}
