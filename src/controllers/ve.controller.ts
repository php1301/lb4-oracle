/* eslint-disable @typescript-eslint/no-explicit-any */
import {inject} from '@loopback/context';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  IsolationLevel,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param,


  patch, post,




  put,

  requestBody,
  response,

  Response, RestBindings
} from '@loopback/rest';
import {VeResponse} from '../@types/ve-response';
import {Ghe, Ve} from '../models';
import {DatVeRepository, VeRepository} from '../repositories';
import {datVeRequest} from './dto/ve.dto';

export class VeController {
  constructor(
    @repository(VeRepository)
    public veRepository: VeRepository,
    @repository(DatVeRepository)
    public datVeRepository: DatVeRepository,
    @inject(RestBindings.Http.RESPONSE) private res: Response,
  ) {}

  @post('/ve')
  @response(200, {
    description: 'Ve model instance',
    content: {'application/json': {schema: getModelSchemaRef(Ve)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ve, {
            title: 'NewVe',
          }),
        },
      },
    })
    ve: Ve,
  ): Promise<Ve> {
    return this.veRepository.create(ve);
  }

  @post('/dat-ve')
  @response(200, {
    description: 'Dat Ve instance',
    content: {'application/json': {schema: getModelSchemaRef(Ve)}},
  })
  async datVe(
    @requestBody(datVeRequest)
    veGhe: Ve & Ghe,
  ): Promise<VeResponse> {
    // ACID Properties
    const {ghe} = veGhe;
    let tongTienVe: any = 0;
    const sql = `
    select VE_TINHTIEN(:p1, :p2) as tong from dual
    `;
    const transaction = await this.veRepository.dataSource.beginTransaction(
      IsolationLevel.SERIALIZABLE,
    );
    let res: VeResponse = {};
    try {
      console.log(veGhe);
      await Promise.all(
        ghe.map(async (i: Ghe) => {
          const tien = (await this.veRepository.execute(
            sql,
            [i.maGhe, veGhe.giaVe],
            {
              transaction,
            },
          )) as any;
          console.log(tien[0].TONG)
          tongTienVe += tien[0].TONG;
        }),
      );
      const veData = {
        ngayDat: new Date().toDateString(),
        giaVe: tongTienVe,
        maLichChieu: veGhe.maLichChieu,
        taiKhoan: veGhe.taiKhoan,
      };
      const v = await this.veRepository.create(veData, {transaction});
      await Promise.all(
        ghe.map(async (i: Ghe) => {
          await this.datVeRepository.create(
            {
              maGhe: i.maGhe,
              maVe: v.maVe,
            },
            {transaction},
          );
        }),
      );
      await transaction.commit();
      res = {
        ve: v,
        ghe,
      };
    } catch (e) {
      console.log(e);
      await transaction.rollback();
      res = {};
    }
    return res;
  }
  @get('/ve/count')
  @response(200, {
    description: 'Ve model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Ve) where?: Where<Ve>): Promise<Count> {
    return this.veRepository.count(where);
  }

  @get('/ve')
  @response(200, {
    description: 'Array of Ve model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Ve, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Ve) filter?: Filter<Ve>): Promise<Ve[]> {
    return this.veRepository.find(filter);
  }

  @patch('/ve')
  @response(200, {
    description: 'Ve PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ve, {partial: true}),
        },
      },
    })
    ve: Ve,
    @param.where(Ve) where?: Where<Ve>,
  ): Promise<Count> {
    return this.veRepository.updateAll(ve, where);
  }

  @get('/ve/{id}')
  @response(200, {
    description: 'Ve model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Ve, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Ve, {exclude: 'where'}) filter?: FilterExcludingWhere<Ve>,
  ): Promise<Ve> {
    return this.veRepository.findById(id, filter);
  }

  @patch('/ve/{id}')
  @response(204, {
    description: 'Ve PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ve, {partial: true}),
        },
      },
    })
    ve: Ve,
  ): Promise<void> {
    await this.veRepository.updateById(id, ve);
  }

  @put('/ve/{id}')
  @response(204, {
    description: 'Ve PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() ve: Ve,
  ): Promise<void> {
    await this.veRepository.replaceById(id, ve);
  }

  @del('/ve/{id}')
  @response(204, {
    description: 'Ve DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.veRepository.deleteById(id);
  }
}
