'use strict';

/**
 * Customized conditions for use in access control.
 */
const customConditions = [
  {
    name: 'isMemberCorporation',
    validator: (
      { permissions, corpSlug }, { corp = null } = {}
    ) => permissions
      .find((perm) => perm.corpSlug === (corp || corpSlug)),
  }, {
    name: 'isMemberApplication',
    validator: (
      { permissions, corpSlug, appSlug }, { corp = null, application = null } = {}
    ) => permissions
      .find((perm) => ((perm.corpSlug === (corp || corpSlug))
        ? perm.applications
          .find((app) => app.appSlug === (application || appSlug))
        : false)),
  },
];

/**
 * Configuration of user access control,
 * depending on the resource, role and action to be performed
 */
const grants = [
  {
    resourceName: 'feature-flag',
    resources: [
      {
        actionName: ['create', 'update', 'delete', 'read'],
        action: {
          roles: ['superadmin', 'admin', 'editor', 'read'],
          condition: {
            Fn: 'custom:isMemberCorporation', args: { corp: 'testCORP' },
          },
        },
      },
    ],
  },
];

module.exports = {
  customConditions,
  grants,
};
