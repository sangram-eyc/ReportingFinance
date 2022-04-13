import { ScaleType } from '../common/types/scale-type.enum';
import { ColorCode } from '../common/types/color-code.enum';

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
      ColorCode.Red
    ]
  },
  {
    name: 'orange',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      ColorCode.Orange
    ]
  },
  {
    name: 'teal',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      ColorCode.Teal
    ]
  },
  {
    name: 'blue',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      ColorCode.Blue
    ]
  },
  {
    name: 'all',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      ColorCode.Green, ColorCode.Blue, ColorCode.Teal, ColorCode.Orange, 
      ColorCode.Red, ColorCode.Grey, 
    ]
  }
];