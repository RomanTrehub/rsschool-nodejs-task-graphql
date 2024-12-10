import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import { graphqlSchema } from './gql-schema.js';
import depthLimit from 'graphql-depth-limit';
import { createDataLoaders } from './dataLoaders.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;

      const gqlDoc = parse(query);

      const errValidErrArr = validate(graphqlSchema, gqlDoc, [depthLimit(5)]);

      if (errValidErrArr.length) {
        return {
          data: null,
          errors: errValidErrArr,
        };
      }

      const gqlDataResult = await graphql({
        schema: graphqlSchema,
        variableValues: variables,
        source: query,
        contextValue: { prisma, ...createDataLoaders(prisma) },
      });

      return gqlDataResult;
    },
  });
};

export default plugin;
