import { TurnComponent } from './turn.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

describe('TurnComponent', () => {
  let component: TurnComponent;
  let fixture: ComponentFixture<TurnComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TurnComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TurnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
