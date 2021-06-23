import {RequestBodyObject} from '@loopback/rest';
export const theLoaiRequest: Partial<RequestBodyObject> = {
  description: 'Request cho gan cac the loai vao phim',
  content: {
    'application/json': {
      schema: {
        properties: {
          theLoai: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                maTheLoai: {type: 'number'},
              },
            },
          },
        },
      },
    },
  },
};
