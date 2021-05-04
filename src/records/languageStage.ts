interface ILanguageStageRecord {
  id: string
  name: string | null
  branchIds: string[]
}

export default class LanguageStageRecord {
  id: string;
  name: string | null;
  branchIds: string[];

  constructor(args: ILanguageStageRecord) {
    this.id = args.id
    this.name = args.name
    this.branchIds = args.branchIds
  }
}
