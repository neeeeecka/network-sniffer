class DBActions {
  constructor(db) {
    this.db = db;
  }

  init = db => {
    this.db = db;
    this.unitsCollection = this.db.collection("userData");
  };

  getUnits = async () => {
    let res = await this.unitsCollection.find({}).toArray();

    return res;
  };
  addUnit = async unitData => {
    if (unitData.mac) {
      let macLen = unitData.mac.length;
      // let descLen = unitData.mac.length
      if (macLen >= 0 && macLen <= 17) {
        let res = await this.unitsCollection.insert({
          mac: unitData.mac,
          description: "",
          type: "active"
        });
        return "User added.";
      } else {
        return "Bad mac";
      }
    } else {
      return "No mac";
    }
  };
  editUnit = async (_id, changes) => {
    const newValues = { $set: changes };
    let result = await this.unitsCollection.findOneAndUpdate(
      { _id: _id },
      newValues
    );
    return result.value;
  };
}
export default DBActions;
