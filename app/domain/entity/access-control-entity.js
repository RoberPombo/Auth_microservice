'use strict';

const { AccessControl } = require('role-acl');

const { accessControlConfig } = require('../config');
const { createUnauthorizedError } = require('../errors');

let ac;

/** Initialize the access control and load the configuration */
const init = async () => {
  if (!ac) {
    ac = new AccessControl();
    accessControlConfig.customConditions.forEach(({ name, validator }) => {
      ac.registerConditionFunction(name, validator);
    });

    accessControlConfig.grants
      .forEach(({ resourceName, resources }) => {
        resources.forEach(({ actionName, action }) => {
          const { roles, condition } = action;
          actionName.forEach((act) => {
            roles.forEach((role) => {
              ac.grant(role).condition(condition)
                .execute(act).on(resourceName);
            });
          });
        });
      });
  }

  return ac;
};

/**
 * Returns the user's role according to the corporation and the application
 * @param {Array<Object>} permissions user permissions
 * @param {String} corpSlug corporation slug
 * @param {String} appSlug application slug
 */
const getRolePerScope = (permissions, corpSlug, appSlug) => {
  const corporation = permissions
    .find((perm) => perm.corpSlug === corpSlug);
  if (!corporation) throw new Error();

  const { role } = appSlug
    ? corporation.applications
      .find((app) => app.appSlug === appSlug)
    : corporation;
  if (!role) throw new Error();

  return role;
};

/**
 * Checks a user's access to a resource.
 * Permissions can be checked at the corporation level or at the application level.
 * @param {Array<Object>} permissions user permissions
 * @param {Object} policies
 * @param {String} policies.action create, update, read o delete
 * @param {String} policies.resource application resources
 * @param {String} policies.corpSlug corporation slug
 * @param {String} [policies.appSlug] application slug
 * @throws UnauthorizedError
 */
const isAllowedTo = async (
  permissions, {
    action,
    resource,
    corpSlug,
    appSlug = '',
  }
) => {
  try {
    await init();

    const role = getRolePerScope(permissions, corpSlug, appSlug);

    const access = await ac.can(role)
      .context({ permissions, corpSlug })
      .execute(action).on(resource);

    if (!access.granted) {
      throw new Error();
    }
  } catch (error) {
    throw createUnauthorizedError(
      'Insufficient permissions',
      `cannot_perform_the_action_${action}`,
      resource
    );
  }
};

module.exports = isAllowedTo;
