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
  Rap,
  LichChieu,
} from '../models';
import {RapRepository} from '../repositories';

export class RapLichChieuController {
  constructor(
    @repository(RapRepository) protected rapRepository: RapRepository,
  ) { }

  @get('/raps/{id}/lich-chieus', {
    responses: {
      '200': {
        description: 'Array of Rap has many LichChieu',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(LichChieu)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<LichChieu>,
  ): Promise<LichChieu[]> {
    return this.rapRepository.lichChieuCuaRap(id).find(filter);
  }

  @post('/raps/{id}/lich-chieus', {
    responses: {
      '200': {
        description: 'Rap model instance',
        content: {'application/json': {schema: getModelSchemaRef(LichChieu)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Rap.prototype.maRap,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LichChieu, {
            title: 'NewLichChieuInRap',
            exclude: ['maLichChieu'],
            optional: ['maRap']
          }),
        },
      },
    }) lichChieu: Omit<LichChieu, 'maLichChieu'>,
  ): Promise<LichChieu> {
    return this.rapRepository.lichChieuCuaRap(id).create(lichChieu);
  }

  @patch('/raps/{id}/lich-chieus', {
    responses: {
      '200': {
        description: 'Rap.LichChieu PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
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
    return this.rapRepository.lichChieuCuaRap(id).patch(lichChieu, where);
  }

  @del('/raps/{id}/lich-chieus', {
    responses: {
      '200': {
        description: 'Rap.LichChieu DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(LichChieu)) where?: Where<LichChieu>,
  ): Promise<Count> {
    return this.rapRepository.lichChieuCuaRap(id).delete(where);
  }
}
