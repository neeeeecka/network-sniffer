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
      } else {
        return "Bad mac";
      }
    } else {
      return "No mac";
    }
  };
}
export default DBActions;
