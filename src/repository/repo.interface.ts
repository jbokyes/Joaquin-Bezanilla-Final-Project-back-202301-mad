export interface Repo<U> {
  query(): Promise<U[]>;
  queryId(_id: string): Promise<U>;
  search(query: { key: string; value: unknown }): Promise<U[]>;
  create(_info: Partial<U>): Promise<U>;
  update(_info: Partial<U>): Promise<U>;
  delete(_id: string): Promise<void>;
}
