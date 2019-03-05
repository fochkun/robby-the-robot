import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RobbyTheRobotComponent } from './robby-the-robot.component';

describe('RobbyTheRobotComponent', () => {
  let component: RobbyTheRobotComponent;
  let fixture: ComponentFixture<RobbyTheRobotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RobbyTheRobotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RobbyTheRobotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
