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
LichChieu,
GheDaDat,
Ghe,
} from '../models';
import {LichChieuRepository} from '../repositories';

export class LichChieuGheController {
  constructor(
    @repository(LichChieuRepository) protected lichChieuRepository: LichChieuRepository,
  ) { }

  @get('/lich-chieus/{id}/ghes', {
    responses: {
      '200': {
        description: 'Array of LichChieu has many Ghe through GheDaDat',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Ghe)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Ghe>,
  ): Promise<Ghe[]> {
    return this.lichChieuRepository.gheDaDat(id).find(filter);
  }

  @post('/lich-chieus/{id}/ghes', {
    responses: {
      '200': {
        description: 'create a Ghe model instance',
        content: {'application/json': {schema: getModelSchemaRef(Ghe)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof LichChieu.prototype.maLichChieu,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ghe, {
            title: 'NewGheInLichChieu',
            exclude: ['maGhe'],
          }),
        },
      },
    }) ghe: Omit<Ghe, 'maGhe'>,
  ): Promise<Ghe> {
    return this.lichChieuRepository.gheDaDat(id).create(ghe);
  }

  @patch('/lich-chieus/{id}/ghes', {
    responses: {
      '200': {
        description: 'LichChieu.Ghe PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ghe, {partial: true}),
        },
      },
    })
    ghe: Partial<Ghe>,
    @param.query.object('where', getWhereSchemaFor(Ghe)) where?: Where<Ghe>,
  ): Promise<Count> {
    return this.lichChieuRepository.gheDaDat(id).patch(ghe, where);
  }

  @del('/lich-chieus/{id}/ghes', {
    responses: {
      '200': {
        description: 'LichChieu.Ghe DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Ghe)) where?: Where<Ghe>,
  ): Promise<Count> {
    return this.lichChieuRepository.gheDaDat(id).delete(where);
  }
}
