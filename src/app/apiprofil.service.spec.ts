import { TestBed } from '@angular/core/testing';

import { ApiprofilService } from './apiprofil.service';

describe('ApiprofilService', () => {
  let service: ApiprofilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiprofilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
