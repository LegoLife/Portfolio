import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatageneratorComponent } from './datagenerator.component';

describe('DatageneratorComponent', () => {
  let component: DatageneratorComponent;
  let fixture: ComponentFixture<DatageneratorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DatageneratorComponent]
    });
    fixture = TestBed.createComponent(DatageneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
