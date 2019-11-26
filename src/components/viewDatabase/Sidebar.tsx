import React from 'react';
import ToolbarStyle from './Sidebar.module.css';
import JoinList from './JoinList';
import DatabaseUIProvider from '../../providers/DatabaseUIProvider';
import AutoComplete from './AutoComplete'
import { Store } from "orbit-db-store";

const SideBar: React.FC<{
  joinEvents: string[],
  selectJoin(join: string): void,
  type: string,
  user: string,
  store: Store,
  goHome(): void,
  uiProvider: DatabaseUIProvider,
  users: string[],
  changePerspective(user: string): void, 
}> = ({ joinEvents, selectJoin, type, user, goHome, uiProvider, store, users, changePerspective }) => {
  return <div className={ToolbarStyle.container}>
    <div className={ToolbarStyle.header} onClick={goHome}>Time Travel</div>
    <uiProvider.getSidebar store={store} />
    <div className={ToolbarStyle.info}>{`Database Type: ${type}`}</div>
    <div className={ToolbarStyle.info}>{`Current User: ${user}`}</div>
    <div>
      <AutoComplete 
        onSubmit={changePerspective}
        suggestions={users} />
      <JoinList 
      joinEvents={joinEvents} 
      selectJoin={selectJoin} />
    </div>
  </div>
}

export default SideBar;