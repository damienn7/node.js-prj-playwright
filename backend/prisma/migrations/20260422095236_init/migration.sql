-- CreateEnum
CREATE TYPE "AnalysisStatus" AS ENUM ('queued', 'running', 'completed', 'failed');

-- CreateTable
CREATE TABLE "Analysis" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "normalizedUrl" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "status" "AnalysisStatus" NOT NULL DEFAULT 'queued',
    "errorMessage" TEXT,
    "summaryJson" JSONB,
    "productMapJson" JSONB,
    "flowsJson" JSONB,
    "apiMapJson" JSONB,
    "uxInsightsJson" JSONB,
    "userStoriesMd" TEXT,
    "flowsMd" TEXT,
    "prdMd" TEXT,
    "uxInsightsMd" TEXT,
    "screenshotsJson" JSONB,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "durationMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Analysis_status_createdAt_idx" ON "Analysis"("status", "createdAt");
