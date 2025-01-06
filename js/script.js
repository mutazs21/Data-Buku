document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('form');
  submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addData();
  });

  if (isStorageExist()) {
      loadDataFromStorage();
  }
});

const datas = [];
const RENDER_EVENT = 'render-data';
const STORAGE_KEY = 'BOOK_APPS';

function isStorageExist() {
  if (typeof(Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
  }
  return true;
}

function saveData() {
  const parsed = JSON.stringify(datas);
  localStorage.setItem(STORAGE_KEY, parsed);
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  if (serializedData !== null) {
      const data = JSON.parse(serializedData);
      for (const item of data) {
          datas.push(item);
      }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function addData() {
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const year = parseInt(document.getElementById('year').value);
  
  const generatedID = generateId();
  const dataObject = generateBookObject(generatedID, title, author, year, false);
  datas.push(dataObject);
  saveData();
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
      id,
      title,
      author,
      year,
      isComplete
  };
}

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedDATAList = document.getElementById('datas');
  uncompletedDATAList.innerHTML = '';
  
  const completedDATAList = document.getElementById('completed-datas');
  completedDATAList.innerHTML = '';
  
  for (const dataItem of datas) {
      const dataElement = makeData(dataItem);
      if (!dataItem.isComplete) {
          uncompletedDATAList.append(dataElement);
      } else {
          completedDATAList.append(dataElement);
      }
  }
});

function makeData(dataObject) {
  const textTitle = document.createElement('h2');
  textTitle.innerText = dataObject.title;
  
  const textAuthor = document.createElement('p');
  textAuthor.innerText = `Penulis: ${dataObject.author}`;
  
  const textYear = document.createElement('p');
  textYear.innerText = `Tahun: ${dataObject.year}`;
  
  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textTitle, textAuthor, textYear);
  
  const container = document.createElement('div');
  container.classList.add('item', 'shadow');
  container.append(textContainer);
  container.setAttribute('id', `data-${dataObject.id}`);

  if (dataObject.isComplete) {
      const undoButton = document.createElement('button');
      undoButton.classList.add('undo-button');
  
      undoButton.addEventListener('click', function () {
          undoTaskFromCompleted(dataObject.id);
      });
  
      const trashButton = document.createElement('button');
      trashButton.classList.add('trash-button');
  
      trashButton.addEventListener('click', function () {
          removeTask(dataObject.id);
      });
  
      container.append(undoButton, trashButton);
  } else {
      const checkButton = document.createElement('button');
      checkButton.classList.add('check-button');
      
      checkButton.addEventListener('click', function () {
          addTaskToCompleted(dataObject.id);
      });
      
      const trashButton = document.createElement('button');
      trashButton.classList.add('trash-button');
      
      trashButton.addEventListener('click', function () {
          removeTask(dataObject.id);
      });
      
      container.append(checkButton, trashButton);
  }
  
  return container;
}

function addTaskToCompleted(dataId) {
  const dataTarget = findData(dataId);
  
  if (dataTarget == null) return;
  
  dataTarget.isComplete = true;
  saveData();
}

function undoTaskFromCompleted(dataId) {
  const dataTarget = findData(dataId);
  
  if (dataTarget == null) return;
  
  dataTarget.isComplete = false;
  saveData();
}

function removeTask(dataId) {
  const dataTargetIndex = findDataIndex(dataId);
  
  if (dataTargetIndex === -1) return;
  
  datas.splice(dataTargetIndex, 1);
  saveData();
}

function findData(dataId) {
  for (const dataItem of datas) {
      if (dataItem.id === dataId) {
          return dataItem;
      }
  }
  return null;
}

function findDataIndex(dataId) {
  for (const index in datas) {
      if (datas[index].id === dataId) {
          return index;
      }
  }
  return -1;
}
