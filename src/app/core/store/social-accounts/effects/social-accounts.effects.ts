import { Injectable } from '@angular/core';
import { SocialAccountFacadeService } from '@app/core/facades/socialAcounts-facade/socialAcounts-facade.service';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import {
  loadSocialAccountss,
  loadSocialAccountssFailure,
  loadSocialAccountssSuccess,
  loadUpdatedSocialAccountss,
  loadSocialAccountssLogout
} from '../actions/social-accounts.actions';
import { IGetSocialNetworksResponse } from '../reducers/social-accounts.reducer';
@Injectable()
export class SocialAccountsEffects {
  constructor(
    private actions$: Actions,
    private socialAccountFacadeService: SocialAccountFacadeService,
    private tokenStorageService: TokenStorageService
  ) {}
  loadSocialAccount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadSocialAccountss, loadUpdatedSocialAccountss),
      concatLatestFrom(() => this.socialAccountFacadeService.socialAccount$),
      mergeMap(([action, account]) => {
        if (
          account === null ||
          action.type === loadUpdatedSocialAccountss.type
        ) {

        }
        return of(
          loadSocialAccountssSuccess({
            data: account as IGetSocialNetworksResponse
          })
        );
      })
    );
  });
}
