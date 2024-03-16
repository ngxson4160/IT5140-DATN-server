export interface IApiResponse {
  meta: {
    code: number;
    statusCode: number;
    message: string;
    extraMeta: object;
  };
  data: object;
}
