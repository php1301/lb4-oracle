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
  HeThongRap,
} from '../models';
import {LichChieuRepository} from '../repositories';

export class LichChieuHeThongRapController {
  constructor(
    @repository(LichChieuRepository)
    public lichChieuRepository: LichChieuRepository,
  ) { }

  @get('/lich-chieus/{id}/he-thong-rap', {
    responses: {
      '200': {
        description: 'HeThongRap belonging to LichChieu',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(HeThongRap)},
          },
        },
      },
    },
  })
  async getHeThongRap(
    @param.path.number('id') id: typeof LichChieu.prototype.maLichChieu,
  ): Promise<HeThongRap> {
    return this.lichChieuRepository.lichChieuHeThongRap(id);
  }
}
