import { PrismaClient, Analysis, AnalysisStatus, Prisma } from '@prisma/client'

const prisma = new PrismaClient();

type createAnalysisPayload = {
    url: string
    normalizedUrl: string
    domain: string
    status: AnalysisStatusEnum
}

enum AnalysisStatusEnum {
    QUEUED = 'queued',
    RUNNING = 'running',
    COMPLETED = 'completed',
    FAILED = 'failed'
}

export const create = async (payload: createAnalysisPayload): Promise<Analysis> => {
  return prisma.analysis.create({ data: payload })
}

export const findMany = async ({ skip = 0, take = 20 }: { skip?: number; take?: number }) => {
  return prisma.analysis.findMany({ orderBy: { createdAt: 'desc' }, skip, take })
}

export const count = async () => {
  return prisma.analysis.count()
}

export const findById = async (id: string) => {
  return prisma.analysis.findUnique({ where: { id } })
}

export const findScreenshotsById = async (id: string) => {
  return prisma.analysis.findUnique({ where: { id }, select: { id: true, screenshotsJson: true } })
}

export const claimQueuedAnalysis = async () => {
  // find oldest queued analysis
  const found = await prisma.analysis.findFirst({ where: { status: 'queued' }, orderBy: { createdAt: 'asc' } })
  if (!found) return null
  const startedAt = new Date()
  return prisma.analysis.update({ where: { id: found.id }, data: { status: 'running', startedAt } })
}

export const deleteById = async (id: string) => {
  return prisma.analysis.delete({ where: { id } })
}

export const updateStatus = async (id: string, status: string) => {
  // trust service-level validation
  return prisma.analysis.update({ where: { id }, data: { status: status as AnalysisStatus } })
}

export const updateById = async (id: string, data: Partial<Prisma.AnalysisUpdateInput>) => {
  return prisma.analysis.update({ where: { id }, data: data as any })
}
