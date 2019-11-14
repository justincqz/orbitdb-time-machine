import { Store } from "orbit-db-store";

export default interface DatabaseUIProvider {
  getSidebar: React.FC<Store>;
  getDataDisplay: React.FC<any>;
  getTooltipMsg: ({entry: any}) => string;
  getTooltipTitle: ({entry: any}) => string;
}
