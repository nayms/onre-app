export const NUMBER_FORMAT_LOCALE = 'en';
export const TOKEN_AMOUNT_DECIMALS = 2;
export const NUMBER_DECIMALS_PERCENTAGE = 2;
export const BP_SCALING_FACTOR = 10000;

// type NumberFormat = ReturnType<typeof Intl.NumberFormat>;

// type NumberFormatterType = (decimal?: number) => NumberFormat;

// export const numberFormatter: NumberFormatterType = (decimals = TOKEN_AMOUNT_DECIMALS) =>
//   new Intl.NumberFormat(NUMBER_FORMAT_LOCALE, {
//     useGrouping: true,
//     ...(decimals >= 0 && { maximumFractionDigits: decimals }),
//   });
//
// export const defaultNumberFormatter = numberFormatter();

export const basisPointsToScalingFactor = (basisPoints: string | number): number =>
  Number(basisPoints) / BP_SCALING_FACTOR + 1;

export const basisPointsToFractionalFactor = (basisPoints: string | number): number =>
  Number(basisPoints) / BP_SCALING_FACTOR;

export const basisPointsToPercent = (basisPoints: string | number): number => Number(basisPoints) / 100;

// export const formatPercent = (value: number, decimals = NUMBER_DECIMALS_PERCENTAGE) => {
//   return `${isNaN(value) ? 0 : (value * 100).toFixed(decimals)}%`;
// };

export const formatPercent = (
  value: number | string | null,
  maximumFractionDigits: number = NUMBER_DECIMALS_PERCENTAGE,
  minimumFractionDigits: number = 0,
) => {
  const numericalValue = value == null ? 0 : typeof value === 'string' ? Number(value) : value;
  return (
    (numericalValue * 100).toLocaleString(NUMBER_FORMAT_LOCALE, {
      minimumFractionDigits,
      maximumFractionDigits,
    }) + '%'
  );
};

export const formatNumber = (
  value?: number | string | null,
  maximumFractionDigits: number = 2,
  minimumFractionDigits: number = 0,
): string => {
  const valueAsNumber = value == null ? 0 : typeof value === 'string' ? Number(value) : value;
  return valueAsNumber.toLocaleString(NUMBER_FORMAT_LOCALE, {
    minimumFractionDigits,
    maximumFractionDigits,
  });
};

// TODO Refactor
