/**
 * Note Model - Repräsentiert eine Sticky Note
 */
export interface Note {
  id: string;
  title: string;
  content: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Note State Pattern - Verschiedene Zustände einer Note
 */
export type NoteState = 'viewing' | 'editing' | 'minimized';

/**
 * Note Klasse mit State Pattern
 */
export class NoteModel implements Note {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  private _state: NoteState = 'viewing';

  constructor(data: Partial<Note> = {}) {
    this.id = data.id ?? crypto.randomUUID();
    this.title = data.title ?? '';
    this.content = data.content ?? '';
    this.color = data.color ?? '#ffffa5';
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? new Date();
  }

  get state(): NoteState {
    return this._state;
  }

  view(): void {
    this._state = 'viewing';
  }

  edit(): void {
    this._state = 'editing';
  }

  minimize(): void {
    this._state = 'minimized';
  }

  updateContent(title: string, content: string): void {
    this.title = title;
    this.content = content;
    this.updatedAt = new Date();
  }

  toJSON(): Note {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      color: this.color,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
