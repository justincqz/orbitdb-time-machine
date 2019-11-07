import DatabaseUIProvider from "../../providers/DatabaseUIProvider";

export default class EventStoreUI implements DatabaseUIProvider {
  getSidebar() {
    throw new Error("Method not implemented.");
  }  
  
  getDataDisplay(index: any) {
    return index.get().map((data) => {
      return {"value" : data.payload.value};
    });
  }


}