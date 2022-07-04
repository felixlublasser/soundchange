import Project from "./records/Project"
import { Result } from "@/lib/result"

export default class State {
  private static openProjects: {
    [index: string]: Project
  } = {}

  static addOpenProject(project: Project): void {
    this.openProjects[project.id] = project
  }

  static getOpenProject(projectId: string): Result<Project> {
    const project = this.openProjects[projectId]
    return project || new Error('Project not found.')
  }
}
