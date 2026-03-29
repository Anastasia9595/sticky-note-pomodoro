/**
 * Observer Pattern - Listener für Timer Events
 */
export type TimerEventType = 'tick' | 'complete' | 'start' | 'pause' | 'reset';
export type TimerListener = (event: TimerEventType, timeLeft: number) => void;

/**
 * Timer Mode
 */
export type TimerMode = 'work' | 'shortBreak' | 'longBreak';

/**
 * Timer Konfiguration
 */
export interface TimerConfig {
  workDuration: number;      // in Sekunden
  shortBreakDuration: number;
  longBreakDuration: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
}

const DEFAULT_CONFIG: TimerConfig = {
  workDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  autoStartBreaks: false,
  autoStartPomodoros: false,
};

/**
 * Pomodoro Timer Klasse mit Observer Pattern
 */
export class PomodoroTimerModel {
  private timeLeft: number;
  private isRunning: boolean = false;
  private mode: TimerMode = 'work';
  private config: TimerConfig;
  private completedPomodoros: number = 0;
  private intervalId: number | null = null;
  private listeners: Set<TimerListener> = new Set();

  constructor(config: Partial<TimerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.timeLeft = this.config.workDuration;
  }

  // Observer Pattern Methods
  subscribe(listener: TimerListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(event: TimerEventType): void {
    this.listeners.forEach((listener) => listener(event, this.timeLeft));
  }

  // Timer Controls
  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.notify('start');
    
    this.intervalId = window.setInterval(() => {
      this.timeLeft--;
      this.notify('tick');
      
      if (this.timeLeft <= 0) {
        this.complete();
      }
    }, 1000);
  }

  pause(): void {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.notify('pause');
  }

  reset(): void {
    this.pause();
    this.timeLeft = this.getDurationForMode(this.mode);
    this.notify('reset');
  }

  private complete(): void {
    this.pause();
    
    if (this.mode === 'work') {
      this.completedPomodoros++;
    }
    
    this.notify('complete');
  }

  setMode(mode: TimerMode): void {
    this.pause();
    this.mode = mode;
    this.timeLeft = this.getDurationForMode(mode);
    this.notify('reset');
  }

  private getDurationForMode(mode: TimerMode): number {
    switch (mode) {
      case 'work':
        return this.config.workDuration;
      case 'shortBreak':
        return this.config.shortBreakDuration;
      case 'longBreak':
        return this.config.longBreakDuration;
    }
  }

  // Getters
  getTimeLeft(): number {
    return this.timeLeft;
  }

  getIsRunning(): boolean {
    return this.isRunning;
  }

  getMode(): TimerMode {
    return this.mode;
  }

  getCompletedPomodoros(): number {
    return this.completedPomodoros;
  }

  updateConfig(config: Partial<TimerConfig>): void {
    this.config = { ...this.config, ...config };
  }
}
