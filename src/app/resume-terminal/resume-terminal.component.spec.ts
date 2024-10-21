import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeTerminalComponent } from './resume-terminal.component';

describe('ResumeTerminalComponent', () => {
  let component: ResumeTerminalComponent;
  let fixture: ComponentFixture<ResumeTerminalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResumeTerminalComponent]
    });
    fixture = TestBed.createComponent(ResumeTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
