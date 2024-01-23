import { PauseComponent } from './pause.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

describe('PauseComponent', () => {
  let component: PauseComponent;
  let fixture: ComponentFixture<PauseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PauseComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PauseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
