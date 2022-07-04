// import SoundChangeRecord from '@/records/SoundChange'
// import Savable from '@/frontend/types/Savable'
// import Store from '@/backend/records/Store'
// import LanguageStage from '@/frontend/models/LanguageStage'
// import { Result, resultify, succeedOrThrow } from '@/lib/result';
// import ISoundChange from '@/frontend/types/ISoundChange'
// import Word from '@/frontend/types/Word';
// import InheritedWord from './InheritedWord';

// export default class SoundChange extends Savable {
//   languageStage: LanguageStage;
//   name: string | null;
//   contextBefore: string;
//   contextAfter: string;
//   replace: string;
//   replaceWith: string;

//   constructor(ls: LanguageStage, args: ISoundChange = {}) {
//     super(args.id)
//     this.languageStage = ls
//     this.name = args.name === undefined ? null : args.name
//     this.contextBefore = args.contextBefore === undefined ? '' : args.contextBefore
//     this.contextAfter = args.contextAfter === undefined ? '' : args.contextAfter
//     this.replace = args.replace === undefined ? '' : args.replace
//     this.replaceWith = args.replaceWith === undefined ? '' : args.replaceWith
//   }

//   static fromStore(store: Store, id: string, languageStage: LanguageStage): Result<SoundChange> {
//     return resultify(() => {
//       const record = succeedOrThrow(store.soundChanges.find(id))
//       const sc = new SoundChange(
//         languageStage,
//         {
//           id: record.id,
//           name: record.name,
//           contextBefore: record.contextBefore,
//           contextAfter: record.contextAfter,
//           replace: record.replace,
//           replaceWith: record.replaceWith,
//         }
//       )
//       return sc
//     })
//   }

//   get toRecord(): SoundChangeRecord {
//     return new SoundChangeRecord({
//       id: this.id,
//       name: this.name,
//       contextBefore: this.contextBefore,
//       contextAfter: this.contextAfter,
//       replace: this.replace,
//       replaceWith: this.replaceWith,
//     })
//   }

//   process(string: string): string {
//     return string.replace(new RegExp(this.replace, 'g'), this.replaceWith)
//   }

//   mangle(word: Word): InheritedWord {
//     return new InheritedWord({ languageStage: this.languageStage, roman: this.process(word.roman), ancestor: word })
//   }
// }
