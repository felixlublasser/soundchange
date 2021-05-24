interface IWordRecord {
  id: string
  roman: string
}

export default class WordRecord {
  id: string;
  roman: string;

  constructor(args: IWordRecord) {
    this.id = args.id
    this.roman = args.roman
  }
}
