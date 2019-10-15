export default class Config {
  public static url(): string {
    const host = process.env.MONGODB_HOST || 'mongodb'
    const port = process.env.MONGODB_PORT || 27017
    const database = process.env.MONGODB_DATABASE || 'app'
    return process.env.MONGODB_URL
      ? process.env.MONGODB_URL
      : `mongodb://${host}:${port}/${database}`
  }

  public static options(): {} {
    const user = process.env.MONGODB_USERNAME || null
    const pass = process.env.MONGODB_PASSWORD || null

    if (user && pass) {
      return {
        user,
        pass,
        useNewUrlParser: true,
        useCreateIndex: true,
      }
    }
    return {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    }
  }
}
