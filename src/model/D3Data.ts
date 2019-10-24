interface D3DataOuput {
  toD3Data(limit: number): D3Data;
}

export type D3Data = {id: string, children: D3Data[]};

export default D3DataOuput;
