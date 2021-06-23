import {Ghe, Ve} from '../models';

export type VeResponse = {
  ve?: Ve;
  ghe?: Partial<Ghe>[];
  upgradeMessage?:string;
  message?: string;
};
