import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdPoolsComponent } from './ad-pools.component';

describe('AdPoolsComponent', () => {
  let component: AdPoolsComponent;
  let fixture: ComponentFixture<AdPoolsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdPoolsComponent]
    });
    fixture = TestBed.createComponent(AdPoolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
