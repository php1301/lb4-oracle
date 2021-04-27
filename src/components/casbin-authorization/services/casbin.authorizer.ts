import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata,
  AuthorizationRequest,
  Authorizer,
} from '@loopback/authorization';
import {inject, Provider} from '@loopback/core';
import * as casbin from 'casbin';
import {RESOURCE_ID} from '../keys';
const debug = require('debug')('loopback:example:acl');
const DEFAULT_SCOPE = 'execute';

// Class level authorizer
export class CasbinAuthorizationProvider implements Provider<Authorizer> {
  constructor(
    @inject('casbin.enforcer.factory')
    private enforcerFactory: (name: string) => Promise<casbin.Enforcer>,
  ) {}

  /**
   * @returns authenticateFn
   */
  value(): Authorizer {
    return this.authorize.bind(this);
  }

  async authorize(
    authorizationCtx: AuthorizationContext,
    metadata: AuthorizationMetadata,
  ): Promise<AuthorizationDecision> {
    const subject = this.getUserName(authorizationCtx.principals[0].id);
    console.log(subject)
    const resourceId = await authorizationCtx.invocationContext.get(
      RESOURCE_ID,
      {optional: true},
    );
    console.log(resourceId)
    const object = resourceId ?? metadata.resource ?? authorizationCtx.resource;
      console.log(object)
    const request: AuthorizationRequest = {
      subject,
      object,
      action: metadata.scopes?.[0] ?? DEFAULT_SCOPE,
    };

    const allowedRoles = metadata.allowedRoles;
    console.log(allowedRoles)
    // Nếu ko có allowRoles hoặc set có giá trị false thì allow all
    if (!allowedRoles) return AuthorizationDecision.ALLOW;
    if (allowedRoles.length < 1) return AuthorizationDecision.DENY;

    let allow = false;
    console.log(request)
    // An optimization for ONLY searching among the allowed roles' policies
    for (const role of allowedRoles) {
      const enforcer = await this.enforcerFactory(role);
      console.log(enforcer)
      const allowedByRole = await enforcer.enforce(
        request.subject,
        request.object,
        request.action,
      );
        console.log(allowedByRole)
      debug(`authorizer role: ${role}, result: ${allowedByRole}`);
      if (allowedByRole) {
        allow = true;
        break;
      }
    }

    debug('final result: ', allow);

    if (allow) return AuthorizationDecision.ALLOW;
    else if (allow === false) return AuthorizationDecision.DENY;
    return AuthorizationDecision.ABSTAIN;
  }

  // Generate the user name according to the naming convention
  // in casbin policy
  // A user's name would be `u${id}`
  getUserName(id: number): string {
    return `u${id}`;
  }
}
