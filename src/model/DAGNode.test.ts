import DAGNode from './DAGNode';

const node = new DAGNode("1", [
  new DAGNode("2", []),
  new DAGNode("3", [])
]);

it('outputs correct D3 Data', () => {
  let d3data = node.toD3Data(Infinity);

  expect(d3data).toEqual(
    expect.objectContaining({
        id: "1",
        children: expect.arrayContaining([
          expect.objectContaining({
              id: "2",
              children: expect.arrayContaining([])
            }
          ),
          expect.objectContaining({
              id: "3",
              children: expect.arrayContaining([])
            }
          )
        ])
      }
    )
  )
});

it('correctly limits output size', () => {
  const limit = 1;
  let d3data = node.toD3Data(limit);
  expect(d3data.children.length).toEqual(2);
})
