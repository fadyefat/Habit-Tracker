import type { MascotState } from '../../types';

import img1 from '../../assets/mascot/510f95f207a1f001c15cee59729ff780-removebg-preview.png';
import img2 from '../../assets/mascot/5b2c2126e7b020eb6ed46bdec31fa9a3-removebg-preview.png';

export const getMascotAsset = (state: MascotState, isDark: boolean): string => {
  if (isDark) {
    return img1;
  } else {
    return img2;
  }
};
