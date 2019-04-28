# Live Filter

Скрипт фильтрации списков (строк таблиц) на чистом JavaScript.

* Сортирует пункты в зависимости от переключения взаимодействующих фильтров.
* Позволяет легко добавлять любое количество фильтров с помощью тегов `input`
* Открывает пункты последовательно.

## Демо

![](https://raw.githubusercontent.com/denzakh/dz-live-filter/master/demo-full/slides/slides.gif)

* Полное демо [English](https://denzakh.github.io/dz-live-filter/demo-full/demo-full-en.html) или [Russian](https://denzakh.github.io/dz-live-filter/demo-full/demo-full-ru.html) - позволяет посмотреть все возможности
* [Минимальное демо](https://denzakh.github.io/dz-live-filter/demo/demo.html) - ничего лишнего, удобно для разработки

## Использование 

### 1. Скачивание файлов

Сделать клонирование проекта в терминале
```
git clone git@github.com:denzakh/dz-live-filter.git
```

Или скачать [ZIP-архив](https://github.com/denzakh/dz-live-filter/archive/master.zip)

### 2. Подключение

Можно использовать как CommonJS модуль, AMD модуль или просто подключить скрипт в HTML.

#### 2a. Like CommonJS module in main JS file

```
let dzLiveFilter = require("./dz-live-filter.js");

dzLiveFilter({
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
    }
});
```

#### 2b. Like script in HTML

```
<script src="/src/dz-live-filter.js"></script>
<script>
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
    }
  });
</script>
```


### 3. Настройки

При инициализации функция dzLiveFilter принимает объект настроек со свойствами.

| Setting name             | Type             | Default                   | Description                                                                                      |
|--------------------------|------------------|---------------------------|--------------------------------------------------------------------------------------------------|
| rootTag                  | string           | ".js-shedule"             | класс корня                                                                                      |
| itemTag                  | string           | ".js-shedule-item"        | класс пунктов списка                                                                             |
| [categoryTag]            | string           | ".js-shedule-category"    | класс категории                                                                                  |
| controlFormTag           | string           | ".js-control-form"        | тег формы <form action="" class="js-control-form"  method="POST" enctype="multipart/form-data">  |
| controlTag               | string           | ".js-control"             | тег каждого контрола (фильтра)                                                                   |
| [delay=0]                | number or string | 0                         | скорость появления пунктов (может сильно затормаживать сортировку)                               |
| [animationCallback]      | function         | См. ниже                  | функция обработки пунктов (строк) таблицы. См. далее.                                            |
| [afterFiltrationCallback]| function         | -                         | функция выполняющаяся после фильтрации.                                                          |

**Default function animationCallback**
```
animationCallback: function aimationCallback (itemNode, result) {
  itemNode.style.display = "none";
  if (result) {
      itemNode.style.display = "";
  }
}
```

### 4. Разметка

* В HTML страницу нужно добавить блок-обертку с классом, указанным в свойстве `rootTag` ("js-shedule").
* В нем должна быть форма с классом, указанным в свойстве `controlFormTag` ("js-control-form") и блок со списком.
* У формы должны быть атрибуты `method="POST" enctype="multipart/form-data"`
* В этом блоке будут фильтруемые строки с классом, указанным в свойстве `itemTag` ("js-shedule-item").

```
<div class="js-shedule">
  <form method="POST" enctype="multipart/form-data" class="js-control-form">
    <!-- Здесь будут элементы управления -->
  </form>
  <div class="table__box">
    <!-- Здесь будут фильтруемые элементы -->
    <p class="js-shedule-item">Value of row 1</p>
    <p class="js-shedule-item">Value of row 2</p>
    <p class="js-shedule-item">Value of row 3</p>
  </div>
</div>
```

Каждый элемент управления представляет собой блок с набором `input[type="checkbox"]`, `input[type="radio"]` или даже `input[type="text"]`, c одинаковыми атрибутами `name`, но размыми значениями `value`.

Все input должны иметь класс, указанный в свойстве `controlTag` ("js-control") и должны быть расположены внутри формы.

```
<form method="POST" enctype="multipart/form-data" class="js-control-form">
  <div class="checkbox-list">
    <input type="checkbox" class="js-control" name="address" id="adress1" value="Street 1" checked>
    <input type="checkbox" class="js-control" name="address" id="adress2" value="Street 2" checked>
  </div>
  <div class="radio-list">
    <input type="radio" class="schedule-filter__radio js-control" name="time" id="time1" value="Today">
    <input type="radio" class="schedule-filter__radio js-control" name="time" id="time2" value="Tomorrow">
    <input type="radio" class="schedule-filter__radio js-control" name="time" id="time3" value="All" checked>
  </div>
</form>
```

Каждая фильтруемая строка должна иметь атрибут `data-filter`, в котором находится JSON-объект, содержащий свойства этой строки.
Каждое свойство соответствует имени фильтра, на который строка будет реагировать. Например `input name="address"` и поле `address`.

Поле содержит массив значений, при выборе которых строка будет показана. 
Например, строка с полем `"time":&nbsp;["All",&nbsp;"Tomorrow"]` будет показана, если выбран checkbox со значением `All` или `Tomorrow`.

```
<div class="table__box">
  <p class="js-shedule-item" data-filter='{"address": ["Street 1"],"time": ["All", "Today"]}'>Value of row 1</p>
  <p class="js-shedule-item" data-filter='{"address": ["Street 2"],"time": ["All", "Tomorrow"]}'>Value of row 2</p>
</div>
```

Если вложить пункты в блок с категорией и добавить этому блоку класс, соответствующий опции `categoryTag` ("js-shedule-category"), то при  фильтрации будет учитываться категория.
Если в результате фильтрации в категории не будет видимых пунктов, то блок категории также будет скрыт.

```
<div class="table__box">
  <h2>Filtered table</h2>
  <div class="js-shedule-category">
    <h3>Category 1</h3>
    <p class="js-shedule-item" data-filter='{"address": ["Street 1"],"time": ["All", "Today"]}'>Value of row 1</p>
    <p class="js-shedule-item" data-filter='{"address": ["Street 2"],"time": ["All", "Tomorrow"]}'>Value of row 2</p>
    <p class="js-shedule-item" data-filter='{"address": ["Street 1"],"time": ["All", "Today"]}'>Value of row 3</p>
    <p class="js-shedule-item" data-filter='{"address": ["Street 2"],"time": ["All", "Today", "Tomorrow"]}'>Value of row 4</p>
  </div>
  <div class="js-shedule-category">
    <h3>Category 2</h3>
    <p class="js-shedule-item" data-filter='{"address": ["Street 2"],"time": ["All", "Today"]}'>Value of row 5</p>
    <p class="js-shedule-item" data-filter='{"address": ["Street 2"],"time": ["All", "Tomorrow"]}'>Value of row 6</p>
  </div>
</div>
```

## Описание работы

### Особенности чекбоксов

Если чекбоксы объединены в одну группу (имеют одно имя) и хотя бы один из них включен (checked), то фильтрация происходит только по активным чекбоксам. Если ни один из них не влючен, показываются все значения.

Фильтры взаимодействуют по типу `логического И`. Например, строка, содержащая `"address": ["Street&nbsp;2"],"time": ["Tomorrow"]` будет показана только в случае, если в разных фильтрах одновременно выбраны и `Street&nbsp;2` и `Tomorrow`

### Особенности работы скрипта

На время фильтрации добавляет к корневому элементу `js-shedule` класс `is-filter-sorting`.
В конце фильтрации добавляет к корневому элементу класс `filter-was-sorted`. Это можно использовать для CSS анимаций.

Если в результате фильтрации количество выводимых элементов стало равно нулю,
к корневому элементу `js-shedule` добавляется класс `is-empty-open-item`
Это можно использовать для вывода сообщения об отсутствии элементов.

### Ограничения и зависимости

Использует объект [formData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) 
 и метод `FormData.entries()`, которые имеют [ограниченную поддержку](https://developer.mozilla.org/en-US/docs/Web/API/FormData#Browser_compatibility) в IE и Safari

Для решения этой проблемы можно подключить [formdata-polyfill](https://www.npmjs.com/package/formdata-polyfill)
