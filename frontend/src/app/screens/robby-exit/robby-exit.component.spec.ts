import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RobbyExitComponent } from './robby-exit.component';

describe('RobbyExitComponent', () => {
  let component: RobbyExitComponent;
  let fixture: ComponentFixture<RobbyExitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RobbyExitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RobbyExitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
