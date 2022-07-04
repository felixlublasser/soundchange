import LanguageBranchInterface from '@/interface/interfaces/LanguageBranch'

export default class LanguageBranch {
  private data: LanguageBranchInterface

  constructor(data: LanguageBranchInterface) {
    this.data = data
  }

  get id(): string {
    return this.data.id
  }

  get name(): string | null {
    return this.data.name
  }

  get branches(): LanguageBranch[] {
    return this.data.branches.map(branch => new LanguageBranch(branch))
  }
}
