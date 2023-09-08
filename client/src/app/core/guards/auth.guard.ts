import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs';
import { currentUser } from 'src/app/account/account.selectors';

import { AppState } from 'src/app/reducers';

export const authGuard: CanActivateFn = (route, state) => {
  const store: Store<AppState> = inject(Store<AppState>);
  const router: Router = inject(Router);
  return store.pipe(
    select(currentUser),
    map(auth => {
      if (auth) return true;
      else {
        router.navigate(['/account/login'], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      }
    })
  );
};
