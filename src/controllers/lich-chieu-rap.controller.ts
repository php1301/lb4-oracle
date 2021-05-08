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
  Rap,
} from '../models';
import {LichChieuRepository} from '../repositories';

export class LichChieuRapController {
  constructor(
    @repository(LichChieuRepository)
    public lichChieuRepository: LichChieuRepository,
  ) { }

  @get('/lich-chieus/{id}/rap', {
    responses: {
      '200': {
        description: 'Rap belonging to LichChieu',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Rap)},
          },
        },
      },
    },
  })
  async getRap(
    @param.path.number('id') id: typeof LichChieu.prototype.maLichChieu,
  ): Promise<Rap> {
    return this.lichChieuRepository.lichChieuRap(id);
  }
}
