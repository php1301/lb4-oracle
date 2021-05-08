import {RequestBodyObject} from '@loopback/rest';
export const datVeRequest: Partial<RequestBodyObject> = {
  description: 'Request cho dat ve',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          ngayDat: {
            type: 'string',
          },
          giaVe: {
            type: 'number',
          },
          maLichChieu: {
            type: 'number',
          },
          taiKhoan: {
            type: 'number',
          },
          ghe: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                maGhe: {type: 'number'},
              },
            },
          },
        },
      },
    },
  },
};
