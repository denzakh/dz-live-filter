# DZ Live Filter

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
Использует объект [formData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) 
 и метод (FormData.entries)[](https://developer.mozilla.org/en-US/docs/Web/API/FormData/entries#Browser_compatibility), которые имеют ограниченную поддержку в IE и Safari

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

@see liveFilter

@example <caption>Подключение</caption>
let liveFilter = require("./liveFilter");

@example <caption>Использование</caption>
// фильтры таблиц
liveFilter({
    rootTag: ".js-shedule",
    itemTag: ".js-shedule-item",
    categoryTag: ".js-shedule-category"
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
