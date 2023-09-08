/* eslint-disable @typescript-eslint/no-empty-function */
import { of, throwError } from 'rxjs';
import { FakeService } from './fake.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('FakeService', () => {
  let service: FakeService;
  let httpClientSpy: any;

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn(),
      post: jest.fn(),
    };

    service = new FakeService(httpClientSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should test getDataV1 return', () => {
    const res = 'Technopsworld';
    const url = 'https://jsonplaceholder.typicode.com/todos/1';
    jest.spyOn(httpClientSpy, 'get').mockReturnValue(of(res));
    service.getDataV1();
    expect(httpClientSpy.get).toBeCalledTimes(1);
    expect(httpClientSpy.get).toHaveBeenCalledWith(url);
  });

  it('should test getDataV2 return', done => {
    const res = 'Technopsworld';
    const url = 'https://jsonplaceholder.typicode.com/todos/1';
    jest.spyOn(httpClientSpy, 'get').mockReturnValue(of(res));
    service.getDataV2().subscribe({
      next: data => {
        expect(data).toEqual(res);
        done();
      },
      error: error => console.log(error),
    });
    expect(httpClientSpy.get).toBeCalledTimes(1);
    expect(httpClientSpy.get).toHaveBeenCalledWith(url);
  });

  it('should test getDataV2 throw error', done => {
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404,
      statusText: 'Not Found',
    });
    const res = 'Technopsworld';
    const url = 'https://jsonplaceholder.typicode.com/todos/1';
    jest
      .spyOn(httpClientSpy, 'get')
      .mockReturnValue(throwError(() => errorResponse));
    service.getDataV2().subscribe({
      next: data => console.log(data),
      error: error => {
        expect(error.message).toContain('test 404 error');
        done();
      },
    });
    expect(httpClientSpy.get).toBeCalledTimes(1);
    expect(httpClientSpy.get).toHaveBeenCalledWith(url);
  });

  it('should test postDataV1', () => {
    const command = 'testing';
    const res = 'Technopsworld';
    const url = 'https://jsonplaceholder.typicode.com/todos/1';
    jest.spyOn(httpClientSpy, 'post').mockReturnValue(of(res));
    service.postDataV1(command);
    expect(httpClientSpy.post).toBeCalledTimes(1);
  });
});
