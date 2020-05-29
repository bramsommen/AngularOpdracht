/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AppModulesComponent } from './AppModules.component';

describe('AppModulesComponent', () => {
  let component: AppModulesComponent;
  let fixture: ComponentFixture<AppModulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppModulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
