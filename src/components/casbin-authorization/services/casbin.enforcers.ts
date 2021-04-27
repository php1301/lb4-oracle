import * as casbin from 'casbin';
import path from 'path';

const POLICY_PATHS = {
  admin: './../../../../fixtures/casbin/rbac_policy.admin.csv',
  client: './../../../../fixtures/casbin/rbac_policy.client.csv',
  vip: './../../../../fixtures/casbin/rbac_policy.vip.csv',
};

export async function getCasbinEnforcerByName(
  name: string,
): Promise<casbin.Enforcer | undefined> {
  const CASBIN_ENFORCERS: {[key: string]: Promise<casbin.Enforcer>} = {
    admin: createEnforcerByRole(POLICY_PATHS.admin),
    client: createEnforcerByRole(POLICY_PATHS.client),
    vip: createEnforcerByRole(POLICY_PATHS.vip),
  };
  if (Object.prototype.hasOwnProperty.call(CASBIN_ENFORCERS, name))
    return CASBIN_ENFORCERS[name];
  return undefined;
}

export async function createEnforcerByRole(
  policyPath: string,
): Promise<casbin.Enforcer> {
  const conf = path.resolve(
    __dirname,
    './../../../../fixtures/casbin/rbac_model.conf',
  );
  const policy = path.resolve(__dirname, policyPath);
  return casbin.newEnforcer(conf, policy);
}
