export default () => {
  const uri = process.env.MONGO_URI;
  const host = process.env.MONGO_HOST;
  const db = process.env.MONGO_DB;
  const options = process.env.MONGO_OPTIONS;

  return {
    database: {
      uri: `${uri}@${host}/${db}${options}`,
    },
  };
};
