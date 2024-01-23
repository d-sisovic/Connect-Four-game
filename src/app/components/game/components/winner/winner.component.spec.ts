import { WinnerComponent } from './winner.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

describe('WinnerComponent', () => {
  let component: WinnerComponent;
  let fixture: ComponentFixture<WinnerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [WinnerComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(WinnerComponent);
    component = fixture.componentInstance;

    component.winnerInfo = {
      firstPlayerWon: false,
      secondPlayerWon: false,
      winningIndexes: []
    };

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
