interface ISoundChangeRecord {
  id: string
  name: string | null
  contextBefore: string
  contextAfter: string
  replace: string
  replaceWith: string
}

export default class SoundChangeRecord {
  id: string;
  name: string | null;
  contextBefore: string;
  contextAfter: string;
  replace: string;
  replaceWith: string;

  constructor(args: ISoundChangeRecord) {
    this.id = args.id
    this.name = args.name
    this.contextBefore = args.contextBefore
    this.contextAfter = args.contextAfter
    this.replace = args.replace
    this.replaceWith = args.replaceWith
  }
}
