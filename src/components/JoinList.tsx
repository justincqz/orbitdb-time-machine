import React from 'react';
import JoinListStyles from './JoinList.module.css';

const JoinList: React.FC<{
  joinEvents: string[],
  selectJoin(join: string): void
}> = ({ joinEvents, selectJoin }) => {
  return <div className={JoinListStyles.container}>
    <h2>Time Travel</h2>
    <div onClick={() => selectJoin(null)} className={JoinListStyles.selection}>Present</div>
    { joinEvents.map((join) => (
      <div 
        key={join} 
        onClick={() => selectJoin(join)}
        className={JoinListStyles.selection}
      >
        Event number {join}
      </div>
    )) }
  </div>
}

export default JoinList;