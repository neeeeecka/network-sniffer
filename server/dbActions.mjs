class DBActions {
  constructor(db) {
    this.db = db;
  }

  getUnits = async () => {
    let collection = this.db.collection("userData");
    let res = await collection.find({}).toArray();

    return res;
  };
}
export default DBActions;
