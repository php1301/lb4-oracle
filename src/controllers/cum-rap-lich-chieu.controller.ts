import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  CumRap,
  LichChieu,
} from '../models';
import {CumRapRepository} from '../repositories';

export class CumRapLichChieuController {
  constructor(
    @repository(CumRapRepository) protected cumRapRepository: CumRapRepository,
  ) { }

  @get('/cum-raps/{id}/lich-chieus', {
    responses: {
      '200': {
        description: 'Array of CumRap has many LichChieu',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(LichChieu)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<LichChieu>,
  ): Promise<LichChieu[]> {
    return this.cumRapRepository.lichChieuCumRap(id).find(filter);
  }

  @post('/cum-raps/{id}/lich-chieus', {
    responses: {
      '200': {
        description: 'CumRap model instance',
        content: {'application/json': {schema: getModelSchemaRef(LichChieu)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof CumRap.prototype.maCumRap,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LichChieu, {
            title: 'NewLichChieuInCumRap',
            exclude: ['maLichChieu'],
            optional: ['maCumRap']
          }),
        },
      },
    }) lichChieu: Omit<LichChieu, 'maLichChieu'>,
  ): Promise<LichChieu> {
    return this.cumRapRepository.lichChieuCumRap(id).create(lichChieu);
  }

  @patch('/cum-raps/{id}/lich-chieus', {
    responses: {
      '200': {
        description: 'CumRap.LichChieu PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LichChieu, {partial: true}),
        },
      },
    })
    lichChieu: Partial<LichChieu>,
    @param.query.object('where', getWhereSchemaFor(LichChieu)) where?: Where<LichChieu>,
  ): Promise<Count> {
    return this.cumRapRepository.lichChieuCumRap(id).patch(lichChieu, where);
  }

  @del('/cum-raps/{id}/lich-chieus', {
    responses: {
      '200': {
        description: 'CumRap.LichChieu DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(LichChieu)) where?: Where<LichChieu>,
  ): Promise<Count> {
    return this.cumRapRepository.lichChieuCumRap(id).delete(where);
  }
}
