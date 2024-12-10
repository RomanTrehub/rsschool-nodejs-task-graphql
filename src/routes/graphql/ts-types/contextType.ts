import { PrismaClient } from '@prisma/client';
import { ReturnedDataLoadersType } from '../dataLoaders.js';

export type Context = { prisma: PrismaClient } & ReturnedDataLoadersType;
