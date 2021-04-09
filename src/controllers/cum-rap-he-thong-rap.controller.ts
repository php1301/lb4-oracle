import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  CumRap,
  HeThongRap,
} from '../models';
import {CumRapRepository} from '../repositories';

export class CumRapHeThongRapController {
  constructor(
    @repository(CumRapRepository)
    public cumRapRepository: CumRapRepository,
  ) { }

  @get('/cum-raps/{id}/he-thong-rap', {
    responses: {
      '200': {
        description: 'HeThongRap belonging to CumRap',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(HeThongRap)},
          },
        },
      },
    },
  })
  async getHeThongRap(
    @param.path.string('id') id: typeof CumRap.prototype.maCumRap,
  ): Promise<HeThongRap> {
    return this.cumRapRepository.cumRapHeThongRap(id);
  }
}
