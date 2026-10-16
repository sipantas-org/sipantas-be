export type FilterConfig<T> = {
  /** Field yang ingin dicari menggunakan substring (contains + insensitive) */
  containsFields?: (keyof T)[];
  /** Pemetaan nama field DTO ke nama field kolom Prisma (misal: search -> activity) */
  fieldMappings?: Partial<Record<keyof T, string>>;
  /** Key DTO yang ingin diabaikan (misal: page, limit, sortBy) */
  ignoreKeys?: (keyof T | string)[];
};

export function buildPrismaWhere<
  TDto extends Record<string, any>,
  TWhere = Record<string, any>,
>(query?: TDto, config: FilterConfig<TDto> = {}): TWhere {
  if (!query) return {} as TWhere;

  const {
    containsFields = [],
    ignoreKeys = ['page', 'limit', 'sortBy', 'sortOrder'],
  } = config;

  const where: Record<string, any> = {};

  for (const [key, value] of Object.entries(query)) {
    if (
      value === undefined ||
      value === null ||
      value === '' ||
      ignoreKeys.includes(key)
    ) {
      continue;
    }

    // Gunakan optional chaining langsung ke config.fieldMappings
    const targetKey =
      (config.fieldMappings?.[key as keyof TDto] as string | undefined) ?? key;

    if (
      containsFields.includes(key as keyof TDto) &&
      typeof value === 'string'
    ) {
      where[targetKey] = { contains: value, mode: 'insensitive' };
    } else {
      where[targetKey] = value;
    }
  }

  return where as TWhere;
}
