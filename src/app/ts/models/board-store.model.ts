import { IPlayerScore } from "./player-score.model";
import { GameSettings } from "../enum/game-settings.enum";

export interface IBoardStore {
  isPaused: boolean;
  gridDisabled: boolean;
  firstPlayerTurn: boolean;
  gameCounter: GameSettings;
  firstPlayerPlayed: boolean;
  playersScore: IPlayerScore;
  board: Array<boolean | null>[];
}
