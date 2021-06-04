export default {
  mongoUrl:
    process.env.MONGO_URL ??
    'mongodb://root:example@localhost:27017/tdd-node?authSource=admin',
  port: process.env.PORT ?? 3000
}
