import * as Boom from '@hapi/boom'
import * as Hapi from '@hapi/hapi'

interface ResponseMeta {
  operation?: string
  method?: string
  paging?: string | null
}

interface ResponseError {
  code?: string | number
  message?: string
  error?: string
}

interface Response<T> {
  meta: ResponseMeta
  data: T[]
  errors: ResponseError[]
}

interface ResponseOptions<T> {
  value?: T | null | undefined
  boom?: Boom<any> | null | undefined
}

export default function createResponse<T>(
  request: Hapi.Request,
  { value = null, boom = null }: ResponseOptions<T>
): Response<T> {
  const errors: ResponseError[] = []
  const data: any = []

  if (boom) {
    errors.push({
      code: boom.output.payload.statusCode,
      error: boom.output.payload.error,
      message: boom.output.payload.message,
    })
  }

  if (value && data) {
    if (Array.isArray(value)) {
      data.push(...value)
    } else {
      data.push(value)
    }
  }

  return {
    meta: {
      method: request.method.toUpperCase(),
      operation: request.url.pathname,
      paging: null,
    },
    data,
    errors,
  }
}
