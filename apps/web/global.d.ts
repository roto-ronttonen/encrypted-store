declare namespace ApiResources {
  export type ListResponse<T = any> = {
    data: T[];
    totalCount: number;
  };

  export type FilesResponse = ListResponse<string>;

  export type UploadFileResponse = {
    status: string;
  };
}
