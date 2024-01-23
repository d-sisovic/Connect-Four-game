import { of } from 'rxjs';
import { signal } from '@angular/core';
import { GameComponent } from './game.component';
import { ActivatedRoute } from '@angular/router';
import { GameMode } from '../../ts/enum/game-mode.enum';
import { RouterTestingModule } from '@angular/router/testing';
import { UtilUiService } from '../../services/util-ui.service';
import { GameFlowService } from '../../services/game-flow.service';
import { GameLogicService } from '../../services/game-logic.service';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  let utilUiService: jest.Mocked<UtilUiService>;
  let gameFlowService: jest.Mocked<GameFlowService>;
  let gameLogicService: jest.Mocked<GameLogicService>;

  beforeEach(waitForAsync(() => {
    gameFlowService = {
      isGamePaused: jest.fn().mockReturnValue(signal(false)),
      getGameCounter: jest.fn().mockReturnValue(signal(1)),
      getGridDisabled: jest.fn().mockReturnValue(signal(false)),
      getPlayerScores: jest.fn().mockReturnValue({ playerOneScore: 1, playerTwoScore: 2 }),
      isFirstPlayerTurn: jest.fn().mockReturnValue(signal(true)),
      initGameCounter$: jest.fn().mockReturnValue(of(1)),
      watchDrawEvent$: jest.fn().mockReturnValue(of(false))(),
      getWinnerInfo$: jest.fn().mockReturnValue(of(null))(),
      watchClearAllFields$: jest.fn().mockReturnValue(of())(),
      watchForNewPlayerTurn$: jest.fn().mockReturnValue(of())(),
      emitNewPlayerTurn: jest.fn(),
      getBoard: jest.fn().mockReturnValue([]),
      resetWholeGame: jest.fn()
    } as unknown as jest.Mocked<GameFlowService>;

    utilUiService = {
      getShowPauseMenu: jest.fn().mockReturnValue(signal(false))(),
    } as unknown as jest.Mocked<UtilUiService>;

    gameLogicService = {
      doesGameHaveWinner: jest.fn().mockReturnValue(false),
      doesGameHaveDrawCondition: jest.fn().mockReturnValue(false)
    } as unknown as jest.Mocked<GameLogicService>;

    TestBed.configureTestingModule({
      imports: [
        GameComponent,
        RouterTestingModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { 'mode': GameMode.CPU } } }
        },
        { provide: UtilUiService, useValue: utilUiService },
        { provide: GameFlowService, useValue: gameFlowService },
        { provide: GameLogicService, useValue: gameLogicService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
