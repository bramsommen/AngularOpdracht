/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EventsJournaalComponent } from './EventsJournaal.component';

describe('EventsJournaalComponent', () => {
  let component: EventsJournaalComponent;
  let fixture: ComponentFixture<EventsJournaalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsJournaalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsJournaalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
