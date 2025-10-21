// Global types for the application

// Dynamic route parameters
export interface DynamicRouteParams {
  [key: string]: string | Promise<string>;
}

// Page props with dynamic route parameters
export interface AppPageProps<T extends DynamicRouteParams = DynamicRouteParams> {
  params: T;
  searchParams: { [key: string]: string | string[] | undefined };
}

// Surah route parameters
export interface SurahParams extends DynamicRouteParams {
  surahNumber: string;
}

// Juz route parameters
export interface JuzParams extends DynamicRouteParams {
  juzNumber: string;
}

// Page route parameters
export interface PageParams extends DynamicRouteParams {
  pageNumber: string;
}

// Hizb route parameters
export interface HizbParams extends DynamicRouteParams {
  hizbNumber: string;
}

// Manzil route parameters
export interface ManzilParams extends DynamicRouteParams {
  manzilNumber: string;
}

// Helper for converting string params to numbers
export function toNumber(param: string | undefined): number {
  if (!param) return 0;
  const num = parseInt(param, 10);
  return isNaN(num) ? 0 : num;
}