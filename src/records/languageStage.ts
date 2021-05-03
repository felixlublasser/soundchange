export default class LanguageStageRecord {
  id!: string;
  name!: string | null;
  ancestorId!: string | null;
  branchIds!: string[];

  // constructor(args: { id: string, name: string | null }) {
  //   super()
  //   Object.assign(this, args)
  // }
}
