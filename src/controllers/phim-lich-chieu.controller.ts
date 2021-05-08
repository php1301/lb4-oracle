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
  Phim,
  LichChieu,
} from '../models';
import {PhimRepository} from '../repositories';

export class PhimLichChieuController {
  constructor(
    @repository(PhimRepository) protected phimRepository: PhimRepository,
  ) { }

  @get('/phims/{id}/lich-chieus', {
    responses: {
      '200': {
        description: 'Array of Phim has many LichChieu',
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
    return this.phimRepository.phimLichChieu(id).find(filter);
  }

  @post('/phims/{id}/lich-chieus', {
    responses: {
      '200': {
        description: 'Phim model instance',
        content: {'application/json': {schema: getModelSchemaRef(LichChieu)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Phim.prototype.maPhim,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LichChieu, {
            title: 'NewLichChieuInPhim',
            exclude: ['maLichChieu'],
            optional: ['maPhim']
          }),
        },
      },
    }) lichChieu: Omit<LichChieu, 'maLichChieu'>,
  ): Promise<LichChieu> {
    return this.phimRepository.phimLichChieu(id).create(lichChieu);
  }

  @patch('/phims/{id}/lich-chieus', {
    responses: {
      '200': {
        description: 'Phim.LichChieu PATCH success count',
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
    return this.phimRepository.phimLichChieu(id).patch(lichChieu, where);
  }

  @del('/phims/{id}/lich-chieus', {
    responses: {
      '200': {
        description: 'Phim.LichChieu DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(LichChieu)) where?: Where<LichChieu>,
  ): Promise<Count> {
    return this.phimRepository.phimLichChieu(id).delete(where);
  }
}
