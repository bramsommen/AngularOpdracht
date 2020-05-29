/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HmiMgmtExchangeCrudComponent } from './HmiMgmtExchangeCrud.component';

describe('HmiMgmtExchangeCrudComponent', () => {
  let component: HmiMgmtExchangeCrudComponent;
  let fixture: ComponentFixture<HmiMgmtExchangeCrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HmiMgmtExchangeCrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HmiMgmtExchangeCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
