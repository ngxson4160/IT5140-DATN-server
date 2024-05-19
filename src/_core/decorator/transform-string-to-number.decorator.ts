import { Transform } from 'class-transformer';

export function TransformStringToNumber() {
  return Transform(({ value }) => (value === '' ? undefined : Number(value)));
}
