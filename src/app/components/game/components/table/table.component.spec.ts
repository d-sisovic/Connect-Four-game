import { of } from 'rxjs';
import { signal } from '@angular/core';
import { TableComponent } from './table.component';
import { GameUiService } from '../../../../services/game-ui.service';
import { GameCpuService } from '../../../../services/game-cpu.service';
import { GameFlowService } from '../../../../services/game-flow.service';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

describe('TableComponent', () => {
  let component: TableComponent;
  let gameUiService: jest.Mocked<GameUiService>;
  let fixture: ComponentFixture<TableComponent>;
  let gameCpuService: jest.Mocked<GameCpuService>;
  let gameFlowService: jest.Mocked<GameFlowService>;

  beforeEach(waitForAsync(() => {
    gameFlowService = {
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

    gameUiService = {
      getMatchingElementByRowColumn: jest.fn(() => null),
      watchClearCellMarkersEvent$: jest.fn(() => of())(),
    } as unknown as jest.Mocked<GameUiService>;

    gameCpuService = {
      watchMarkRandomCircleEvent$: jest.fn(() => of(1))(),
    } as unknown as jest.Mocked<GameCpuService>;

    TestBed.configureTestingModule({
      imports: [TableComponent],
      providers: [
        { provide: GameUiService, useValue: gameUiService },
        { provide: GameCpuService, useValue: gameCpuService },
        { provide: GameFlowService, useValue: gameFlowService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
