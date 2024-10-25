export type EventType = 'RANDOM_NUMBER';
export type EventWinner = 'Protector' | 'Evilman' | 'Both' | 'None';
export interface Event {
  type: EventType;
  timer: number;
}
