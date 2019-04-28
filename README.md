# DZ Live Filter

Скрипт фильтрации списков (строк таблиц) на чистом JavaScript.

* Сортирует пункты в зависимости от переключения взаимодействующих фильтров.
* Позволяет легко добавлять любое количество фильтров с помощью тегов <input>
* Открывает пункты последовательно.

---

![](https://raw.githubusercontent.com/denzakh/dz-live-filter/master/demo-full/slides/slides.gif)

---

## Демо

* [Минимальное демо](https://denzakh.github.io/dz-live-filter/demo/demo.html) (удобно для разработки) 
* Полное демо [English](https://denzakh.github.io/dz-live-filter/demo-full/demo-full-en.html) или [Russian](https://denzakh.github.io/dz-live-filter/demo-full/demo-full-ru.html)
* [Видео](https://youtu.be/vPtYdjl97m0)

## Использование 

### 1. Скачивание файлов

Сделать клонирование проекта в терминале
```
git clone git@github.com:denzakh/dz-live-filter.git
```

Или скачать [ZIP-архив](https://github.com/denzakh/dz-live-filter/archive/master.zip)

### 2. Подключение

Можно подключать как CommonJS модуль, AMD модуль или используя скрипт в HTML.

#### 2.a Like CommonJS module in main JS file

```
let liveFilter = require("./liveFilter");

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
    }
});
```

#### 2.b Like script in HTML

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


### 3. Настройка

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

* В HTML страницу нужно добавить блок-обертку с классом, указанным в свойстве rootTag ("js-shedule").
* В нем должна быть форма с классом, указанным в свойстве controlFormTag ("js-control-form") и блок со списком.
* В этом блоке будут фильтруемые строки с классом, указанным в свойстве itemTag ("js-shedule-item").

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

## Описание

### Особенности структуры
Фильтры и фильтруемая таблица должны быть внутри блока с классом из свойства настроек `rootTag`.
Фильтры находятся внутри формы с классом из свойства `controlFormTag`.
У формы должны быть атрибуты `method="POST" enctype="multipart/form-data"`
Поля фильтров с классом `controlTag` (текстовые инпуты, чекбоксы, радиокнопки) 
расположены внутри формы, обязательно должны иметь имя и значение.

### Особенности чекбоксов
Если чекбоксы объединены в одну группу (имеют одно имя) и хотя бы один из них включен (checked),
то фильтрация происходит по активным чекбоксам.
Если ни один из них не влючен, показываются все значения.

### Особенности работы скрипта
На время фильтрации добавляет к корневому элементу (rootTag) класс `is-filter-sorting`.
В конце фильтрации добавляет к корневому элементу класс `filter-was-sorted`.
Если в результате фильтрации количество выводимых элементов стало равно нулю,
к корневому элементу `rootTag` добавляется класс `is-empty-open-item`

### Ограничения и зависимости
Использует объект [formData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) 
 и метод `FormData.entries()`, которые имеют [ограниченную поддержку](https://developer.mozilla.org/en-US/docs/Web/API/FormData#Browser_compatibility) в IE и Safari

Для решения этой проблемы можно подключить [formdata-polyfill](https://www.npmjs.com/package/formdata-polyfill)

### Категории
Если вложить пункты внутри блоков категории и добавить этим блокам класс,
соответствующий опции `categoryTag`, то такие категории будут скрываться,
если в результате фильтрации в них не будет пунктов