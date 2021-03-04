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

  // 通过遍历旧列表，找出被移除的项目和新添加的项目
  // 并将其存放到队列中
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

  // 复制existChild用于后续操作
  let compareList = existChildren.slice(0);

  // 对existChildren中标记为null的项目进行移除标记
  compareList.map((item, index) => {
    if (item === null) {
      remove(index);
      removeSimulate(index);
    }
  });

  // 比较 newList 和 compareList，进行 插入/移动 操作
  let i = 0;
  let j = 0;
  while (i < newList.length) {
    let item = newList[i];
    let itemKey = getItemKey(item);

    let simulateItem = compareList[j];
    let simulateItemKey = getItemKey(simulateItem);

    if (simulateItem) {
      if (itemKey === simulateItemKey) {
        j++;
      } else {
        if (!oldKeyIndex.hasOwnProperty(itemKey)) { 
          // itemKey 不存在于旧列表则为新增item
          insert(i, item);
        } else { 
          // 与列表中的下一个元素进行比较
          let nextSimulateItem = compareList[j + 1];
          let nextSimulateItemKey = getItemKey(nextSimulateItem);
          if(nextSimulateItemKey === itemKey) {
            // 通过移除当前元素使得两个元素相同
            remove(i); 
            removeSimulate(j); 
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
