export interface Pagination<T> {
  id: string;
  pageIndex: number;
  pageSize: number;
  count: number;
  data: T;
}
