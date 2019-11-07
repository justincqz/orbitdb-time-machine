import { Store } from "orbit-db-store";

export default interface DatabaseUIProvider {
  getSidebar: React.FC<Store>;
  getDataDisplay(index);
}