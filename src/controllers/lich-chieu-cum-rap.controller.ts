import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  LichChieu,
  CumRap,
} from '../models';
import {LichChieuRepository} from '../repositories';

export class LichChieuCumRapController {
  constructor(
    @repository(LichChieuRepository)
    public lichChieuRepository: LichChieuRepository,
  ) { }

  @get('/lich-chieus/{id}/cum-rap', {
    responses: {
      '200': {
        description: 'CumRap belonging to LichChieu',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(CumRap)},
          },
        },
      },
    },
  })
  async getCumRap(
    @param.path.number('id') id: typeof LichChieu.prototype.maLichChieu,
  ): Promise<CumRap> {
    return this.lichChieuRepository.lichChieuCumRap(id);
  }
}
