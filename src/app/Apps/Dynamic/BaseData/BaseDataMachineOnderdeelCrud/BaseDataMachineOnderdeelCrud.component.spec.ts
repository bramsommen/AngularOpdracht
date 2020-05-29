/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BaseDataMachineOnderdeelCrudComponent } from './BaseDataMachineOnderdeelCrud.component';

describe('BaseDataMachineOnderdeelCrudComponent', () => {
  let component: BaseDataMachineOnderdeelCrudComponent;
  let fixture: ComponentFixture<BaseDataMachineOnderdeelCrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseDataMachineOnderdeelCrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseDataMachineOnderdeelCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
