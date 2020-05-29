/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BaseDataEigenschapCrudComponent } from './BaseDataEigenschapCrud.component';

describe('BaseDataEigenschapCrudComponent', () => {
  let component: BaseDataEigenschapCrudComponent;
  let fixture: ComponentFixture<BaseDataEigenschapCrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseDataEigenschapCrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseDataEigenschapCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
