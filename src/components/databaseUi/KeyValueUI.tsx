import DatabaseUIProvider from "../../providers/DatabaseUIProvider";

export default class KeyValueUI implements DatabaseUIProvider {
  getSidebar() {
    throw new Error("Method not implemented.");
  }  
  
  getDataDisplay(index: any) {
    return Object.keys(index._index).map((key) => {
      return { key: key, value: index._index[key] }
    })
  }
}