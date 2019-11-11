import React from 'react';
import ToolbarStyle from './Sidebar.module.css';
import JoinList from './JoinList';
import DatabaseUIProvider from '../../providers/DatabaseUIProvider';
import { Store } from "orbit-db-store";

const SideBar: React.FC<{
  joinEvents: string[],
  selectJoin(join: string): void,
  type: string,
  store: Store,
  goHome(): void,
  uiProvider: DatabaseUIProvider
}> = ({ joinEvents, selectJoin, type, goHome, uiProvider, store }) => {
  return <div className={ToolbarStyle.container}>
    <div className={ToolbarStyle.header} onClick={goHome}>Time Travel</div>
    <uiProvider.getSidebar store={store} />
    <div className={ToolbarStyle.info}>{`Database Type: ${type}`}</div>
    <div>
      <JoinList 
      joinEvents={joinEvents} 
      selectJoin={selectJoin} />
    </div>
  </div>
}

export default SideBar;