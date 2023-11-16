import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdPoolsDashboardComponent } from './ad-pools-dashboard.component';

describe('AdPoolsDashboardComponent', () => {
  let component: AdPoolsDashboardComponent;
  let fixture: ComponentFixture<AdPoolsDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdPoolsDashboardComponent]
    });
    fixture = TestBed.createComponent(AdPoolsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
