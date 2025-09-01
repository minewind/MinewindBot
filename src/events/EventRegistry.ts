import { BaseMessageEvent } from '../MessageEvent';
import {
    WelcomeEvent, VoteEvent, SharpeningEvent, SystemEvent, ChatEvent, DeathEvent,
    SnovasionStartEvent, SnovasionEndEvent,
    LabyrinthStartEvent, LabyrinthEndEvent,
    BeefStartEvent, BeefEndEvent,
    AbyssalStartEvent, AbyssalEndEvent,
    AttackOnGiantStartEvent, AttackOnGiantEndEvent,
    FoxHuntStartEvent, FoxHuntEndEvent, FoxHuntLeaderboardEvent,
    BaitStartEvent, BaitEndEvent, BaitLeaderboardEvent,
    CastleStartEvent, CastleControlEvent,
    TDMStartEvent, TDMEndEvent,
    FFAStartEvent, FFAEndEvent, FFALeaderboardEvent
} from './MinecraftEvents';

type MessageEventConstructor = (new (message: string) => BaseMessageEvent) & {
    isValid(message: string): boolean;
};


const eventMatchers: MessageEventConstructor[] = [
    SnovasionStartEvent, SnovasionEndEvent,
    LabyrinthStartEvent, LabyrinthEndEvent,
    BeefStartEvent, BeefEndEvent,
    AbyssalStartEvent, AbyssalEndEvent,
    AttackOnGiantStartEvent, AttackOnGiantEndEvent,
    FoxHuntStartEvent, FoxHuntEndEvent, FoxHuntLeaderboardEvent,
    BaitStartEvent, BaitEndEvent, BaitLeaderboardEvent,
    CastleStartEvent, CastleControlEvent,
    TDMStartEvent, TDMEndEvent,
    FFAStartEvent, FFAEndEvent, FFALeaderboardEvent,
    WelcomeEvent,
    VoteEvent,
    SharpeningEvent,
    SystemEvent,
    ChatEvent,
    DeathEvent
];

export function processMessage(message: string): BaseMessageEvent | null {
  for (const EventClass of eventMatchers) {
    if (EventClass.isValid(message)) {
      return new EventClass(message);
    }
  }
  return null;
}
