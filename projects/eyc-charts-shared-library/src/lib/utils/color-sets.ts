import { ScaleType } from '../common/types/scale-type.enum';

export interface Color {
  name: string;
  selectable: boolean;
  group: ScaleType;
  domain: string[];
}

export let colorSets: Color[] = [
  {
    name: 'red',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      '#FF736A'
    ]
  },
  {
    name: 'orange',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      '#FF9831'
    ]
  },
  {
    name: 'teal',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      '#42C9C2'
    ]
  }
];
