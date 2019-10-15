import * as Hapi from '@hapi/hapi'
import Boom from '@hapi/boom'
import newResponse from '../../../helper/response'
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import PackageJson from '../../../../package.json'

export default class HelthCheckController {
  public get = async (
    request: Hapi.Request,
    toolkit: Hapi.ResponseToolkit
  ): Promise<Hapi.ResponseObject> => {
    try {
      const result = {
        result: 'I am alive!',
        version: PackageJson.version,
        name: PackageJson.name,
        description: PackageJson.description,
      }
      return toolkit.response(newResponse(request, { value: result }))
    } catch (error) {
      console.log(error)
      return toolkit
        .response(
          newResponse(request, {
            boom: Boom.internal(error),
          })
        )
        .code(500)
    }
  }
}
