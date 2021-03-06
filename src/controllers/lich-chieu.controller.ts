import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  Response,
  response,
  RestBindings,
} from '@loopback/rest';
import {DateTime} from 'luxon';
import {LichChieu} from '../models';
import {LichChieuRepository} from '../repositories';

export class LichChieuController {
  constructor(
    @repository(LichChieuRepository)
    public lichChieuRepository: LichChieuRepository,
    @inject(RestBindings.Http.RESPONSE) protected res: Response,
  ) {}

  @post('/lich-chieu')
  @response(200, {
    description: 'LichChieu model instance',
    content: {'application/json': {schema: getModelSchemaRef(LichChieu)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LichChieu, {
            title: 'NewLichChieu',
            exclude: ['maLichChieu'],
          }),
        },
      },
    })
    lichChieu: Omit<LichChieu, 'maLichChieu'>,
  ): Promise<LichChieu | Response<{message?: string}>> {
    try {
      return await this.lichChieuRepository.create(lichChieu);
    } catch (e) {
      let message = '';
      if (e.message.split('ORA')[1])
        message = e.message.split('ORA')[1].substring(8);
      else message = 'Tạo lịch chiếu lỗi ' + e.message;
      return this.res.status(400).json({message});
    }
  }

  @get('/lich-chieu/count')
  @response(200, {
    description: 'LichChieu model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(LichChieu) where?: Where<LichChieu>,
  ): Promise<Count> {
    return this.lichChieuRepository.count(where);
  }

  @get('/lich-chieu')
  @response(200, {
    description: 'Array of LichChieu model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(LichChieu, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(LichChieu) filter?: Filter<LichChieu>,
  ): Promise<LichChieu[]> {
    const FORMAT_STRING = "yyyy-MM-dd'T'HH:mm:ssZZ";
    const data = await this.lichChieuRepository.find(filter);
    data.forEach((nc, index) => {
      const isoString = new Date(nc.ngayChieuGioChieu);
      const convertToRightTimezone = DateTime.fromISO(isoString.toISOString())
        .setZone('Asia/Bangkok')
        .toFormat(FORMAT_STRING);
      console.log(convertToRightTimezone);
      data[index].ngayChieuGioChieu = convertToRightTimezone;
    });
    return data;
  }

  @patch('/lich-chieu')
  @response(200, {
    description: 'LichChieu PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LichChieu, {partial: true}),
        },
      },
    })
    lichChieu: LichChieu,
    @param.where(LichChieu) where?: Where<LichChieu>,
  ): Promise<Count> {
    return this.lichChieuRepository.updateAll(lichChieu, where);
  }

  @get('/lich-chieu/{id}')
  @response(200, {
    description: 'LichChieu model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(LichChieu, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(LichChieu, {exclude: 'where'})
    filter?: FilterExcludingWhere<LichChieu>,
  ): Promise<LichChieu> {
    return this.lichChieuRepository.findById(id, filter);
  }

  @patch('/lich-chieu/{id}')
  @response(204, {
    description: 'LichChieu PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LichChieu, {partial: true}),
        },
      },
    })
    lichChieu: LichChieu,
  ): Promise<void> {
    await this.lichChieuRepository.updateById(id, lichChieu);
  }

  @put('/lich-chieu/{id}')
  @response(204, {
    description: 'LichChieu PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() lichChieu: LichChieu,
  ): Promise<void> {
    await this.lichChieuRepository.replaceById(id, lichChieu);
  }

  @del('/lich-chieu/{id}')
  @response(204, {
    description: 'LichChieu DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.lichChieuRepository.deleteById(id);
  }
}
