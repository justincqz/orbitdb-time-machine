import DAGNode from './DAGNode';

const node = new DAGNode("1", [
  new DAGNode("2", []),
  new DAGNode("3", [])
]);

it('outputs correct D3 Data', () => {
  let d3data = node.toD3Data(Infinity);

  expect(d3data).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: '1',
        parentIds: expect.arrayContaining([
          "2", "3"
        ])
      }),
      expect.objectContaining({
        id: '2',
        parentIds: []
      }),
      expect.objectContaining({
        id: '3',
        parentIds: []
      })
    ])
  )
});

it('correctly limits output size', () => {
  const limit = 1;
  let d3data = node.toD3Data(limit);
  expect(d3data.length).toEqual(1);
})
