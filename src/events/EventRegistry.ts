import { BaseMessageEvent } from '../MessageEvent';
import {
  WelcomeEvent, VoteEvent, SnovasionEvent, LabyrinthEvent, BeefEvent,
  DragonEvent, DeatheffectEvent, GiveawayEvent, ResetEvent
} from './MinecraftEvents'; // Assuming you move all event classes to this directory

type MessageEventConstructor = new (message: string) => BaseMessageEvent;

const eventMatchers: MessageEventConstructor[] = [
  WelcomeEvent,
  VoteEvent,
  SnovasionEvent,
  LabyrinthEvent,
  BeefEvent,
  DragonEvent,
  DeatheffectEvent,
  GiveawayEvent,
  ResetEvent
];

/**
 * Processes a raw Minecraft message and returns an instantiated event object if a match is found.
 * @param message The raw message string from the Minecraft server.
 * @returns An instance of a MessageEvent class or null if no match is found.
 */
export function processMessage(message: string): BaseMessageEvent | null {
  for (const EventClass of eventMatchers) {
    if ('isValid' in EventClass && typeof EventClass.isValid === 'function' && EventClass.isValid(message)) {
      return new EventClass(message);
    }
  }
  return null;
}
