import { AppComponent } from './app.component';
import { AccountService } from './account/account.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BasketService } from './basket/basket.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NavBarComponent } from './core/nav-bar/nav-bar.component';
import { SectionHeaderComponent } from './core/section-header/section-header.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import 'src/app/tests/localStorageMock';
import { of } from 'rxjs';
import { BreadcrumbService } from 'xng-breadcrumb';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  let component: AppComponent;
  let accountServiceMock: any;
  let basketServiceMock: any;
  let breadCrumbServiceMock: any;
  let store: MockStore<{ loggedIn: boolean }>;
  let getItemSpy: jest.SpyInstance;

  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    accountServiceMock = {
      loadCurrentUser: jest.fn(),
    };

    basketServiceMock = {
      getBasket: jest.fn(),
    };

    breadCrumbServiceMock = {};

    await TestBed.configureTestingModule({
      declarations: [AppComponent, NavBarComponent, SectionHeaderComponent],
      providers: [
        {
          provide: AccountService,
          useValue: accountServiceMock,
        },
        {
          provide: BasketService,
          useValue: basketServiceMock,
        },
        {
          provide: BreadcrumbService,
          useValue: breadCrumbServiceMock,
        },
        provideMockStore({
          initialState: {},
        }),
      ],
      imports: [RouterTestingModule, NgxSpinnerModule],
    }).compileComponents();

    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    localStorage.clear();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    getItemSpy = jest.spyOn(localStorage, 'getItem');
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should load basket if basket_id is available in localStorage', () => {
    const basketId = 'testBasketId';
    localStorage.setItem('basket_id', basketId);
    fixture.detectChanges();
    expect(getItemSpy).toHaveBeenCalledWith('basket_id');
    expect(basketServiceMock.getBasket).toHaveBeenCalledWith(basketId);
  });

  it('should not load basket if basket_id is not available in localStorage', () => {
    fixture.detectChanges();
    expect(getItemSpy).toHaveBeenCalledWith('basket_id');
    expect(basketServiceMock.getBasket).not.toHaveBeenCalledWith('test');
  });

  it('should load current user when token is available in localStorage', () => {
    jest.spyOn(accountServiceMock, 'loadCurrentUser').mockReturnValue(of(null));
    const token = 'testToken';
    localStorage.setItem('token', token);
    fixture.detectChanges();
    expect(localStorage.getItem).toHaveBeenCalledWith('token');
    expect(accountServiceMock.loadCurrentUser).toHaveBeenCalledWith(token);
  });

  it('should load current user when token is available in localStorage', () => {
    jest.spyOn(accountServiceMock, 'loadCurrentUser').mockReturnValue(of(null));
    const token = 'testToken';
    localStorage.setItem('token', token);
    fixture.detectChanges();
    expect(localStorage.getItem).toHaveBeenCalledWith('token');
    expect(accountServiceMock.loadCurrentUser).toHaveBeenCalledWith(token);
  });

  it('should not load current user when token is not available in localStorage', () => {
    jest.spyOn(accountServiceMock, 'loadCurrentUser').mockReturnValue(of(null));
    fixture.detectChanges();
    expect(localStorage.getItem).toHaveBeenCalledWith('token');
    expect(accountServiceMock.loadCurrentUser).not.toHaveBeenCalled();
  });
});
