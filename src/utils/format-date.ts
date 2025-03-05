import { format } from 'date-fns';

export const formatLocalShortDate = (value: string | number | Date): string => format(value, 'PP');
