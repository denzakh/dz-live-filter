"use strict";

/*

# dzLiveFilter

## What is this?
Скрипт фильтрации таблиц на чистом JS
Сортирует строки таблицы в зависимости от переключения фильтров.
Открывает пункты из пошагово, с заданным интервалом.

![](liveFilter.png)

##### Особенности структуры
Фильтры и фильтруемая таблица должны быть внутри блока с классом из свойства настроек `rootTag`.
Фильтры находятся внутри формы с классом из свойства `controlFormTag`.
У формы должны быть атрибуты `method="POST" enctype="multipart/form-data"`
Поля фильтров с классом `controlTag` (текстовые инпуты, чекбоксы, радиокнопки)
расположены внутри формы, обязательно должны иметь имя и значение.

##### Особенности чекбоксов
Если чекбоксы объединены в одну группу (имеют одно имя) и хотя бы один из них включен (checked),
то фильтрация происходит по активным чекбоксам.
Если ни один из них не влючен, показываются все значения.

##### Особенности работы скрипта
На время фильтрации добавляет к корневому элементу (rootTag) класс `is-filter-sorting`.
В конце фильтрации добавляет к корневому элементу класс `filter-was-sorted`.
Если в результате фильтрации количество выводимых элементов стало равно нулю,
к корневому элементу `rootTag` добавляется класс `is-empty-open-item`

##### Ограничения и зависимости
Использует объект formData, который имеет плохую поддержку в IE и Safari
Для решения этой проблемы можно подключить полифил `https://www.npmjs.com/package/formdata-polyfill`

##### Категории
Если вложить пункты внутри блоков категории и добавить этим блокам класс,
соответствующий опции `categoryTag`, то такие категории будут скрываться,
если в результате фильтрации в них не будет пунктов

```
<div class="checkbox">
  <input type="checkbox" class="js-control" name="address" id="adress1" value="Street 1" checked>
  <input type="checkbox" class="js-control" name="address" id="adress2" value="Street 2" checked>
</div>
<div class="radio-list">
  <input type="radio" class="schedule-filter__radio js-control" name="time" id="time1" value="Today">
  <input type="radio" class="schedule-filter__radio js-control" name="time" id="time2" value="Tomorrow">
  <input type="radio" class="schedule-filter__radio js-control" name="time" id="time3" value="All" checked>
</div>
```
В пунктах itemTag, в атрибуте data-filter должны находится JSON-объект,
свойства которого должны соответствовать именам фильтров,
а значения - содержать массив строк, которое это свойство может принимать у данного пункта.
```
<div class="js-shedule-category">
  <div class="js-shedule-item" data-filter='{
      "address": ["Street 1"],
      "time": ["All", "Today"],
  }'>Value of row 1</div>
  <div class="js-shedule-item" data-filter='{
      "address": ["Street 2"],
      "time": ["All", "Tomorrow"],
  }'>Value of row 2</div>
</div>
```
@property {string} rootTag - класс корня
@property {string} itemTag - класс пунктов списка
@property {string} [categoryTag] - класс категории
@property {string} controlFormTag - тег формы <form action="" class="js-control-form"  method="POST" enctype="multipart/form-data">
@property {string} controlTag - тег каждого контрола (фильтра)
@property {number | string} [delay=0] - скорость появления пунктов (может сильно затормаживать сортировку)
@property {function} [animationCallback] - функция обработки пунктов (строк) таблицы. См. далее.
@property {function} [afterFiltrationCallback] - функция выполняющаяся после фильтрации. Например, для нумерации строк.

@see dzLiveFilter

@example <caption>Подключение</caption>
let dzLiveFilter = require("./dzLiveFilter");

@example <caption>Использование</caption>
// фильтры таблиц
dzLiveFilter({
    rootTag: ".js-shedule",
    itemTag: ".js-shedule-item",
    categoryTag: ".js-shedule-category",
    controlFormTag: ".js-control-form",
    controlTag: ".js-control",
    delay: 0,
    animationCallback: function aimationCallback (itemNode, result) {
        itemNode.style.display = "none";
        if (result) {
            itemNode.style.display = "";
        }
    },
    afterFiltrationCallback: setTableRowNumber
});

@example <caption>Функция по умолчанию</caption>
let defaultAimationCallback = function (itemNode, result) {
    if (result) {
        itemNode.style.display = "";
    } else {
        itemNode.style.display = "none";
    }
}

@example <caption>Функция нумерации строк</caption>
// строки таблицы должны содержать класс ".js-filter-item", а ячейка с номером - ".js-number"
function setTableRowNumber() {
  var numberList = document.querySelectorAll(".js-filter-item");
  numberList = Array.from(numberList);
  var filteredList = numberList.filter((item)=>{return (item.style.display !== "none")});
  filteredList.forEach((item,i)=>{
    item.querySelector(".js-number").innerHTML = i + 1;
  });
}
setTableRowNumber();


 */


/*! dzLiveFilter.js v1.4.0 | (c) 2019 @denzakh | https://github.com/denzakh */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
    console.log("amd");
  } else if (typeof exports === 'object') {
    module.exports = factory;
    console.log("CommomJS");
  } else {
    root.dzLiveFilter = factory;
  }
})(this, function(option) {

	let defaultOption = {
	    rootTag: ".js-shedule",
	    itemTag: ".js-shedule-item",
	    categoryTag: ".js-shedule-category",
	    controlFormTag: ".js-control-form",
	    controlTag: ".js-control",
	    delay: 0,
	    animationCallback: function aimationCallback (itemNode, result) {
	        itemNode.style.display = "none";
	        if (result) {
	            itemNode.style.display = "";
	        }
	    }
	}


	// run
	function init(option = defaultOption) {

		// SETTING

		// default action on item after filtering
		let defaultAimationCallback = function (itemNode, result) {
			if (result) {
				itemNode.style.display = "";
			} else {
				itemNode.style.display = "none";
			}
		}

		// creating a list of forms
		let rootList = document.querySelectorAll(option.rootTag);
		rootList = Array.from(rootList);

		let animationCallback = option.animationCallback || defaultAimationCallback;
		let delay = option.delay || 0;
		let rootCount = 0;


		// INIT
		// init forms
		rootList.forEach(function (rootEl) {
			doRootInit(rootEl, option);
			rootCount = rootCount + 1;
		});

		// init one form
		function doRootInit(rootEl, option) {

			// preparing a list of children
			let form = rootEl.querySelector(option.controlFormTag);
			let itemList = rootEl.querySelectorAll(option.itemTag);
			itemList = Array.from(itemList);
			let controlList = rootEl.querySelectorAll(option.controlTag);
			controlList = Array.from(controlList);
			let itemArray = [];
			let itemTotalCount;
			let itemActiveCount;

			// creating an array from the filtered list
			itemList.forEach(function (item) {
				doItemsArray(itemArray, item);
			});

			// filtering and initialization of filters
			controlList.forEach(function (control) {
				control.onchange = function(e) {
					console.time("all");
					// add animation class to root
					rootEl.classList.remove("filter-was-sorted");
					rootEl.classList.add("is-filter-sorting");

					// get object with filter settings
					let formDataObj = getFilterOption(form);

					if(JSON.stringify(formDataObj) == "{}") {
						// all items will be shown if no filters are enabled
						itemArray.forEach(function (item) {
							animationCallback(item[0], true);
						});
						// show all categories
						filterCategory(rootEl);
						// отключаем анимацию
						rootEl.classList.remove("is-filter-sorting");
						rootEl.classList.add("filter-was-sorted");
						console.log("открыты все " + itemArray.length + " элементов");
					} else {
						// if filters are on
						itemArray.forEach(function (item) {
							animationCallback(item[0], false);
						});

						// data filtering (passing an object with list items and filters)
						doListFiltering(itemArray, formDataObj, rootEl);

						// TODO: add sending settings to the server - sendAjax (form, formDataObj);
					}

				}
			});
		}


		// FILTRATION

		// creating an array from the filtered list
		function doItemsArray(itemArray, item) {
			if (item.dataset.filter) {
				let itemData = item.dataset.filter;
				itemData = JSON.parse(itemData);
				let insetData = [item, itemData];
				itemArray.push(insetData);
			} else {
				console.error(item, "filtering data not found");
				// item.style.backgroundColor = "rgba(255,0,0,0.5)";
			}
		}

		// collecting filter states
		function getFilterOption(form) {
			// collect all fields (name, value) into the formData object
			let formData = new FormData(form);
			// the formData object is transformed into a formDataObj object containing properties in the form of arrays
			let formDataObj = {};

			 // if the browser does not support it (ie, safari)
			 // you can connect the polyfil https://www.npmjs.com/package/formdata-polyfill
			if( window.FormData === undefined ) {
				console.error("The formData object is not supported by your brooser. You need to use the polyfil https://www.npmjs.com/package/formdata-polyfill");
			}

			// iterate the object using the formData.entries () iterator
			for(var pair of formData.entries()) {

			   let controlName = pair[0];
			   let controlValue = pair[1];
			   if (!formDataObj[controlName]) {
					formDataObj[controlName] = [];
				}
				formDataObj[controlName].push(controlValue);
			}

			return formDataObj;
		}

		// фильтрация данных
		function doListFiltering(itemArray, formDataObj, rootEl) {

			// create delay counter
			let delayLocal = delay;
			// create a counter open items
			let countOpenItem = 0;

			// iteration of the array with filtered items
			itemArray.forEach(function (listitem, i) {

				let itemNode = listitem[0]; // list item in HTML
				let itemData = listitem[1]; // array of filtering settings for this item

				var setFinalResultBind = setFinalResult.bind(listitem);
				listitem.result = false;

				function generalCountCallback() {
					// if the item is shown, increment the counter
					if (listitem.result) {
						countOpenItem = countOpenItem + 1;
					}

					// if the array has been moved, output the total result
					if (i == itemArray.length - 1) {
						// console.log("open " + countOpenItem + " from " + itemArray.length);
						setCountOpenItem(countOpenItem, rootEl);
						if (option.afterFiltrationCallback) {
							option.afterFiltrationCallback();
						}
					}
				}

				// creating an object with settings
				let compareData = {
					listitem: listitem,
					formDataObj: formDataObj, // array of filter settings for all
					itemData: itemData, // array of filtering settings for this item
					setFinalResult: setFinalResultBind, // final count function
					itemNode: itemNode, // list item in HTML
					animationCallback: animationCallback // функция анимации
				};

				// creating promise and starting comparison
				function getPromise() {

					let promise = new Promise((resolve, reject) => {
						compareArr(compareData, resolve);
					});

					promise.then(
						result => {
							generalCountCallback()
						}
					);
				}

				// delayed response (for animation)
				if (delay) {
				  setTimeout(getPromise, delayLocal);
				  delayLocal = delayLocal + delay;
				} else {
				  getPromise();
				}
			});


			// array comparison function
			function compareArr(compareData, resolve) {
				let listitem = compareData.listitem;
				let formDataObj = compareData.formDataObj;
				let itemData = compareData.itemData;
				let setFinalResult = compareData.setFinalResult;
				let itemNode = compareData.itemNode;
				let animationCallback = compareData.animationCallback;
				let resultArr = []; // results repository

				// counting the number of properties in an object
				let formDataObjLength = Object.keys(formDataObj).length;
				let formDataObjIndex = formDataObjLength;



				// the function adds the result of the property to the result array
				function setLocalResult(formInnerArrIndex, formInnerLength, localResult) {
					// check if this is the last local loop
					// if true then send the local result of the property to the array of results
					if(formInnerArrIndex + 1 === formInnerLength) {
						resultArr.push(localResult);
						// we check that formDataObjIndex = 0 (the last property) and then we consider the final result
						if(!formDataObjIndex) {
							resolve("result");
							return setFinalResult(resultArr, itemNode, animationCallback);
						}
					}
				}

				for(let key in formDataObj) {
					// counting the number of properties in an object
					formDataObjIndex = formDataObjIndex - 1;

					// iterate the first level of the formDataObj object (filter object)
					// make sure the item has such a property
					if (!itemData[key]) {
						console.error("свойство " + key + " не найдено в строке");
						break;
					} else {
						// if the property is, check it for the type array
						if (Array.isArray(itemData[key])) {
							// console.log("  Свойство: " + key);

							// select current properties
							let itemInnerArr = itemData[key]; // array item properties
							let formInnerArr = formDataObj[key]; // array of filter properties
							let localResult = false;
							let formInnerLength = formInnerArr.length; // counting values in the property array

							// iterating over the filter property values
							formInnerArr.forEach(function(itemInner, formInnerArrIndex) {

								// for each we look for a match in the item property array
								if( itemInnerArr.includes(itemInner) )  {
									// if at least one value matches, the property is true
									localResult = true;
									setLocalResult(formInnerArrIndex, formInnerLength, localResult);

								} else {
									setLocalResult(formInnerArrIndex, formInnerLength, localResult);
								}
							});

						} else {
							console.error("property " + key + " not an array");
							break;
						}
					}
				}
			}

			// final result determination function
			function setFinalResult(resultArr, itemNode, animationCallback) {

				// check for missing properties
				// if it does not find false in the results array, returns 0
				function findFalseResult() {
					return ~find(resultArr, false);
				}

				// return the final result of the comparison of filters and the item of filtered data
				if(!findFalseResult())  {
					// item will be shown
					animationCallback(itemNode, true);
					this.result = true;
					return true;
				} else {
					// item will be hidden
					animationCallback(itemNode, false);
					this.result = false;
					return false;
				}
			}

			// changes in root styles after filtering, activation of the message about the absence of found items
			function setCountOpenItem(countOpenItem, rootEl) {

				if (!countOpenItem) {
					rootEl.classList.add("is-empty-open-item");
				} else {
					rootEl.classList.remove("is-empty-open-item");
				}

				rootEl.classList.remove("is-filter-sorting");
				rootEl.classList.add("filter-was-sorted");
				filterCategory(rootEl);
			}
		}



		// SERVICE FUNCTIONS

		// array search function
		 function find(array, value) {
			if ([].indexOf) {
				return array.indexOf(value);
			} else {
				for (var i = 0; i < array.length; i++) {
					if (array[i] === value) return i;
				}
				return -1;
			}
		}

		// category filtering
		function filterCategory(rootEl) {

			console.timeEnd("all");

			if(option.categoryTag) {

				let categoryTag = option.categoryTag;
				let itemTag = option.itemTag;

				let categoryList = rootEl.querySelectorAll(categoryTag);
				categoryList = Array.from(categoryList);

				categoryList.forEach(function(category){
					let itemList = category.querySelectorAll(itemTag);
					itemList = Array.from(itemList);

					if (itemList.length > 0) {

						let openCategory = false;

						itemList.forEach(function(item){
							if(item.style.display != "none") {
								openCategory = true;
							}
						});

						if (openCategory) {
							category.style.display = "";
						} else {
							category.style.display = "none";
						}
					}

				});

			}
		}
	}

	init(option);
});












