/**
 * Todo Model - Repräsentiert ein Todo-Item
 */
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  noteId?: string; // Optional: Verknüpfung zu einer Note
  createdAt: Date;
  completedAt?: Date;
}

/**
 * Todo Klasse
 */
export class TodoModel implements Todo {
  id: string;
  text: string;
  completed: boolean;
  noteId?: string;
  createdAt: Date;
  completedAt?: Date;

  constructor(data: Partial<Todo> = {}) {
    this.id = data.id ?? crypto.randomUUID();
    this.text = data.text ?? '';
    this.completed = data.completed ?? false;
    this.noteId = data.noteId;
    this.createdAt = data.createdAt ?? new Date();
    this.completedAt = data.completedAt;
  }

  toggle(): void {
    this.completed = !this.completed;
    this.completedAt = this.completed ? new Date() : undefined;
  }

  updateText(text: string): void {
    this.text = text;
  }

  toJSON(): Todo {
    return {
      id: this.id,
      text: this.text,
      completed: this.completed,
      noteId: this.noteId,
      createdAt: this.createdAt,
      completedAt: this.completedAt,
    };
  }
}
