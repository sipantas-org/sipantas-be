export interface PaginateArgs<
  TWhere = unknown,
  TOrderBy = unknown,
  TInclude = unknown,
  TSelect = unknown,
> {
  skip?: number;
  take?: number;
  where?: TWhere;
  orderBy?: TOrderBy;
  include?: TInclude;
  select?: TSelect;
}

export interface PaginateDelegate<
  TItem = unknown,
  TArgs extends PaginateArgs = PaginateArgs,
> {
  findMany(args?: TArgs): Promise<TItem[]>;
  count(args?: { where?: TArgs['where'] }): Promise<number>;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginateResult<TItem> {
  data: TItem[];
  pagination: PaginationMeta;
}

export async function findPage<TItem, TArgs extends PaginateArgs>(
  delegate: PaginateDelegate<TItem, TArgs>,
  args: TArgs,
): Promise<PaginateResult<TItem>> {
  const [data, total] = await Promise.all([
    delegate.findMany(args),
    delegate.count({ where: args.where }),
  ]);

  const limit = args.take ?? 10;
  const skip = args.skip ?? 0;

  // Hitung nomor halaman berdasarkan (skip / take) + 1
  const page = limit > 0 ? Math.floor(skip / limit) + 1 : 1;
  const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}
