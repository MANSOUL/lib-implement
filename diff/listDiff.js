function getkeyIndexFree (list) {
  let keyIndex = {};
  let free = [];
  list.map((item, index) => {
    if (item.key) {
      keyIndex[item.key] = index;
    } else {
      free.push(item);
    }
  });
  return {
    keyIndex,
    free
  };
}


function listDiff (newList, oldList) {
  let newKeyIndexFree = getkeyIndexFree(newList);
  let oldKeyIndexFree = getkeyIndexFree(oldList);
  let newKeyIndex = newKeyIndexFree.keyIndex, newFree = newKeyIndexFree.free;
  let oldKeyIndex = oldKeyIndexFree.keyIndex, oldFree = oldKeyIndexFree.free;

  let moves = [];
  let existChildren = [];
  let freeIndex = 0;

  // 1. 判断就列表中的项是否存在，移除了或没移除
  oldList.map(item => {
    let key = getItemKey(item);
    if (key) {
      if (newKeyIndex.hasOwnProperty(key)) {
        existChildren.push(newList[newKeyIndex[key]]);
      } else {
        existChildren.push(null);
      }
    } else {
      existChildren.push(newFree[freeIndex++] || null);
    }
  });

  let compareList = existChildren.slice(0);

  // 2. null 为需要移除的项目
  compareList.map((item, index) => {
    if (item === null) {
      remove(index);
      removeSimulate(index);
    }
  });

  // 3. newList 与 compareList 进行 插入/移动 项目，所谓移动就是通过插入和移除实现的
  // i -> newList's index
  // j -> compareList's index
  let i = j = 0;
  while (i < newList.length) {
    let item = newList[i];
    let itemKey = getItemKey(item);

    let simulateItem = compareList[j];
    let simulateItemKey = getItemKey(simulateItem);

    if (simulateItem) {
      if (itemKey === simulateItemKey) { // 刚好是一一对应
        j++;
      } else {
        if (!oldKeyIndex.hasOwnProperty(itemKey)) { // simulateKey 肯定会存在于oldList中的，itemKey不存在则为新增item
          insert(i, item);
        } else { // 移动
          let nextSimulateItem = compareList[j + 1];
          let nextSimulateItemKey = getItemKey(nextSimulateItem);
          if(nextSimulateItemKey === itemKey) {
            remove(i); // 最终要操作的是旧树，所以应该在相应的旧树的i的位置进行操作
            removeSimulate(j); // 执行相应的移除工作
            j++;
          } else {
            insert(i, item);
          }
        }
      }
    } else {
      insert(i, item);
    }

    i++;
  }


  function remove (index) {
    let move = {index, type: 0};
    moves.push(move);
  }

  function removeSimulate (index) {
    compareList.splice(index, 1);
  }

  function insert(index, item) {
    let move = { index, item, type: 1 };
    moves.push(move);
  }

  return {
    moves,
    children: existChildren
  };
}

function getItemKey(item, key = 'key') {
  if (!item || !key) return void 666
  return typeof key === 'string' ?
    item[key] :
    key(item)
}

const newTree = [
  {key: 1, label: 'k-1'},
  {key: 0, label: 'k-0'},
  {key: 4, label: 'k-4'},
  {key: 3, label: 'k-3'},
  {label: 'k-6'},
  {label: 'k-7'},
]

const oldTree = [
  {key: 0, label: 'k-0'},
  {key: 1, label: 'k-1'},
  {key: 2, label: 'k-2'},
  {key: 3, label: 'k-3'},
  {key: 4, label: 'k-4'},
  {key: 5, label: 'k-5'},
  {label: 'k-6'},
]

const ooldTree = [...oldTree];

const o = listDiff(newTree, oldTree);
o.moves.map(m => {
  if (m.type === 0) {
    ooldTree.splice(m.index, 1);
  } else {
    ooldTree.splice(m.index, 0, m.item);
  }
});

console.log(ooldTree)