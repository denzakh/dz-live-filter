# Live Filter

Script filtering lists (rows of tables) in <span style="background: yellow">pure JavaScript</span>. [Translation into Russian](https://github.com/denzakh/dz-live-filter/blob/master/README.ru.md)

* Sorts items depending on the switching of interacting filters.
* Allows you to easily add any number of filters using the `input` tags.
* Opens items in sequence.

![](https://img.shields.io/github/repo-size/denzakh/dz-live-filter.svg)
![](https://img.shields.io/static/v1.svg?label=version&message=1.4.0&color=orange)
![](https://img.shields.io/github/last-commit/denzakh/dz-live-filter.svg)
![](https://img.shields.io/badge/license-Apache%202-blue.svg) 

## Demo

![](https://raw.githubusercontent.com/denzakh/dz-live-filter/master/demo-full/slides/slides.gif)

* [Full demo](https://denzakh.github.io/dz-live-filter/demo-full/demo-full-en.html) - allows you to see all the possibilities.
* [Minimal demo](https://denzakh.github.io/dz-live-filter/demo/demo.html) - convenient to use as a template for development.

## Getting Started

### 1. Download files

Make a project cloning in the terminal

```
git clone git@github.com:denzakh/dz-live-filter.git
```

Or download [ZIP archive](https://github.com/denzakh/dz-live-filter/archive/master.zip)

### 2. Installing

You can use it as a CommonJS module, an AMD module, or just plug the script into HTML.

#### 2a. Like CommonJS module in main JS file

```
let dzLiveFilter = require ("./dz-live-filter.js");

dzLiveFilter ({
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
<script src = "/src/dz-live-filter.js"> </ script>
<script>
  dzLiveFilter ({
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
</ script>
```

### 3. Settings

During initialization, the `dzLiveFilter` function accepts a settings object with properties.

| Setting name             | Type             | Default                   | Description |
|--------------------------|------------------|---------------------------|--------------------------------------------------------------------------------------------------|
| rootTag                  | string           | ".js-shedule"             | root class                                                                                      |
| itemTag                  | string           | ".js-shedule-item"        | item class списка                                                                             |
| [categoryTag]            | string           | ".js-shedule-category"    | category class                                                                                  |
| controlFormTag           | string           | ".js-control-form"        | form class  |
| controlTag               | string           | ".js-control"             | control class (фильтра)                                                                   |
| [delay=0]                | number or string | 0                         | the speed of the appearance of points (can greatly slow down the sorting)                               |
| [animationCallback]      | function         | См. ниже                  | the function of processing items (rows) of the table. See below.                                        |
| [afterFiltrationCallback]| function         | -                         | function after filtering.                                                          |

**Default function animationCallback**
```
animationCallback: function aimationCallback (itemNode, result) {
  itemNode.style.display = "none";
  if (result) {
      itemNode.style.display = "";
  }
}
```

### 4. HTML

* In the HTML page, you need to add a block wrapper with the class specified in the `rootTag` ("js-shedule") property.
* It must have a form with the class specified in the property `controlFormTag` ("js-control-form") and a block with a list.
* A form must have the attributes `method =" POST "enctype ="multipart/form-data "`.
* In this block there will be filtered lines with the class specified in the `itemTag` ("js-shedule-item") property.

```
<div class="js-shedule">
  <form method="POST" enctype="multipart/form-data" class="js-control-form">
    <!-- There will be controls -->
  </form>
  <div class="table__box">
    <!-- There will be filtered items -->
    <p class="js-shedule-item">Value of row 1</p>
    <p class="js-shedule-item">Value of row 2</p>
    <p class="js-shedule-item">Value of row 3</p>
  </div>
</div>
```

Each control is a block with a set of `input [type="checkbox"]`, `input [type="radio"]` or even `input [type="text"]`, with the same attributes `name`, but blur values `value`.

All inputs must have a class specified in the `controlTag` ("js-control") property and must be located inside the form.

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

Each filtered string must have a `data-filter` attribute containing a JSON object containing the properties of this string.
Each property corresponds to the name of the filter to which the line will respond. For example, `input name="address"` and the field `address`.

The field contains an array of values that, when selected, will display the string.
For example, a line with a field `"time":["All", "Tomorrow"]` will be shown if a checkbox with the value `All` or `Tomorrow` is selected.

```
<div class="table__box">
  <p class="js-shedule-item" data-filter='{"address": ["Street 1"],"time": ["All", "Today"]}'>Value of row 1</p>
  <p class="js-shedule-item" data-filter='{"address": ["Street 2"],"time": ["All", "Tomorrow"]}'>Value of row 2</p>
</div>
```

If you put points into a block with a category and add a block to this block that matches the `categoryTag` ("js-shedule-category") option, then the category will be taken into account when filtering.
If as a result of filtering there are no visible items in the category, the category block will also be hidden.

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

## Description of work

### Checkbox Features

If checkboxes are combined into one group (they have one name) and at least one of them is included (checked), then filtering occurs only by active checkboxes. If none of them are included, all values ​​are displayed.

Filters interact by the type of `logical AND`. For example, a string containing
`"address":["Street 2"],"time":["Tomorrow"]` will be shown only if `Street 2` and `Tomorrow` are selected in different filters simultaneously.

### Features of the script

At the time of filtering, it adds the class `is-filter-sorting` to the root element` js-shedule`.
At the end of the filtering, adds the class `filter-was-sorted` to the root element. This can be used for CSS animations.

If, as a result of filtering, the number of output elements is zero,
the class `is-empty-open` is added to the root element `js-shedule`
This can be used to display a missing item message.

### Limitations and dependencies

Uses the [formData object](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
 and the `FormData.entries()` method, which have [limited support](https://developer.mozilla.org/en-US/docs/Web/API/FormData#Browser_compatibility) in brousers.

To solve this problem you can connect [formdata-polyfill](https://www.npmjs.com/package/formdata-polyfill)
