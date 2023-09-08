import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SectionHeaderComponent } from './core/section-header/section-header.component';
import { NavBarComponent } from './core/nav-bar/nav-bar.component';
import { RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { StoreModule } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { BasketService } from './basket/basket.service';
import { AccountService } from './account/account.service';

describe('AppComponent', () => {
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NgxSpinnerModule,
        RouterModule,
        HttpClientModule,
        StoreModule,
        BreadcrumbModule,
      ],
      declarations: [AppComponent, SectionHeaderComponent, NavBarComponent],
      providers: [
        provideMockStore({
          initialState: { books: { entities: [] } },
        }),
        BasketService,
        AccountService,
      ],
    });

    store = TestBed.inject(MockStore);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Skinet'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Skinet');
  });
});

// it('should render title', () => {
//   const fixture = TestBed.createComponent(AppComponent);
//   fixture.detectChanges();
//   const compiled = fixture.nativeElement as HTMLElement;
//   expect(compiled.querySelector('.content span')?.textContent).toContain(
//     'client app is running!'
//   );
// });
