import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarvelbrowserComponent } from './marvelbrowser.component';

describe('MarvelbrowserComponent', () => {
  let component: MarvelbrowserComponent;
  let fixture: ComponentFixture<MarvelbrowserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarvelbrowserComponent]
    });
    fixture = TestBed.createComponent(MarvelbrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
