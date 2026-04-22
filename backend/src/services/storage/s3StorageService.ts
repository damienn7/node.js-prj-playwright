import fs from 'fs/promises'
import path from 'path'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const AWS_REGION = process.env.AWS_REGION || ''
const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET || ''
const AWS_S3_PUBLIC_BASE_URL = process.env.AWS_S3_PUBLIC_BASE_URL || ''

const s3Client = new S3Client({ region: AWS_REGION || undefined })

const sanitize = (s: string) => s.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase()

export type S3UploadResult = {
  stepIndex: number
  label: string
  filePath: string
  storage: 's3'
  s3Key: string
  url: string
}

export const uploadScreenshot = async (localFilePath: string, analysisId: string, stepIndex: number, label = 'screenshot'): Promise<S3UploadResult> => {
  if (!AWS_S3_BUCKET) throw new Error('AWS_S3_BUCKET not configured')

  const ext = path.extname(localFilePath) || '.png'
  const baseName = `step-${stepIndex}-${sanitize(label)}${ext}`
  const key = `analyses/${analysisId}/${baseName}`

  const body = await fs.readFile(localFilePath)

  const cmd = new PutObjectCommand({
    Bucket: AWS_S3_BUCKET,
    Key: key,
    Body: body,
    ContentType: 'image/png'
  })

  await s3Client.send(cmd)

  let url = ''
  if (AWS_S3_PUBLIC_BASE_URL) {
    url = `${AWS_S3_PUBLIC_BASE_URL.replace(/\/$/, '')}/${key}`
  } else if (AWS_REGION) {
    url = `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`
  } else {
    url = `https://${AWS_S3_BUCKET}.s3.amazonaws.com/${key}`
  }

  return {
    stepIndex,
    label,
    filePath: path.relative(process.cwd(), localFilePath),
    storage: 's3',
    s3Key: key,
    url
  }
}

export default { uploadScreenshot }
