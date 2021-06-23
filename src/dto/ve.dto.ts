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
          khuyenMai: {
            type: 'string',
          },
          diemTichLuySuDung:{
            type: 'number',
          },
          maLichChieu: {
            type: 'number',
          },
          taiKhoan: {
            type: 'number',
          },
          giamGia: {
            type: 'number',
          },
          loaiVe: {
            type: 'string',
          },
          hinhAnh: {
            type: 'string',
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
