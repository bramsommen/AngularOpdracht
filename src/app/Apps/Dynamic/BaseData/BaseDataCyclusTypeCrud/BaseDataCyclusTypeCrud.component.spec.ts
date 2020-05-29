/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BaseDataCyclusTypeCrudComponent } from './BaseDataCyclusTypeCrud.component';

describe('BaseDataCyclusTypeCrudComponent', () => {
  let component: BaseDataCyclusTypeCrudComponent;
  let fixture: ComponentFixture<BaseDataCyclusTypeCrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseDataCyclusTypeCrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseDataCyclusTypeCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
