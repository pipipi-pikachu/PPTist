export type ErrorCode =
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'validation'
  | 'conflict'
  | 'quota_exceeded'
  | 'doc_too_large'
  | 'rate_limited'
  | 'export_failed'

export interface ValidationIssue {
  path: string
  message: string
}

export class AppError extends Error {
  readonly status: number
  readonly code: ErrorCode
  readonly issues?: unknown

  constructor(status: number, code: ErrorCode, message: string, issues?: unknown) {
    super(message)
    this.name = 'AppError'
    this.status = status
    this.code = code
    this.issues = issues
  }

  static unauthorized(message = '凭证无效或已失效') {
    return new AppError(401, 'unauthorized', message)
  }

  static forbidden(message = '没有执行该操作的权限') {
    return new AppError(403, 'forbidden', message)
  }

  static notFound(message = '文档不存在') {
    return new AppError(404, 'not_found', message)
  }

  static validation(message: string, issues?: ValidationIssue[]) {
    return new AppError(400, 'validation', message, issues)
  }

  static conflict(message: string, issues?: unknown) {
    return new AppError(409, 'conflict', message, issues)
  }

  static quotaExceeded(message: string) {
    return new AppError(403, 'quota_exceeded', message)
  }

  static docTooLarge(message: string) {
    return new AppError(413, 'doc_too_large', message)
  }

  static exportFailed(message: string) {
    return new AppError(500, 'export_failed', message)
  }
}
