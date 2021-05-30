interface ILanguageStageRecord {
  id: string
  name: string | null
  branchIds: string[]
  originalWordIds: string[]
  soundChangeIds: string[]
}

export default class LanguageStageRecord {
  id: string;
  name: string | null;
  branchIds: string[];
  originalWordIds: string[];
  soundChangeIds: string[];

  constructor(args: ILanguageStageRecord) {
    this.id = args.id
    this.name = args.name
    this.branchIds = args.branchIds
    this.originalWordIds = args.originalWordIds
    this.soundChangeIds = args.soundChangeIds
  }
}
