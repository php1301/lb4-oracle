import {RequestBodyObject} from '@loopback/rest';
export const doiPasswordRequest: Partial<RequestBodyObject> = {
  description: 'Request cho doi mat khau',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          oldPassword: {
            type: 'string',
          },
          newPassword: {
            type: 'string',
          },
        },
      },
    },
  },
};
