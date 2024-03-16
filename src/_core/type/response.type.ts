export interface IApiMeta {
  code: number;
  statusCode: number;
  message: string;
  extraMeta?: object;
}

export interface IApiResponse {
  meta: IApiMeta;
  data: object | null;
}
