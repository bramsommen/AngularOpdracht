/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MachineOnderdeelSelectorComponent } from './MachineOnderdeelSelector.component';

describe('MachineOnderdeelSelectorComponent', () => {
  let component: MachineOnderdeelSelectorComponent;
  let fixture: ComponentFixture<MachineOnderdeelSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineOnderdeelSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineOnderdeelSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
