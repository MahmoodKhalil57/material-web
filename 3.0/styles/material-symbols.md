# Material Symbols

md-gb-icon axes: optical size, weight, fill and grade.

Each variable font axis of `md-gb-icon` is a custom property. See
[Icons](/material-web/3.0/styles/icons/) for loading the font and the defaults.

**Example: An icon imported by path**

*HTML*

```html
<md-gb-icon>star</md-gb-icon>
```

*JavaScript*

```js
import '@material/web/labs/gb/styles/icon/md-gb-icon.js';
```

## Optical sizes

The optical size follows `--md-icon-size`, which supports 20, 24, 40 and 48px.

**Example: Icons at 20, 24, 40 and 48 pixels**

```html
<md-gb-icon style="--md-icon-size: 20px">star</md-gb-icon>
<md-gb-icon>star</md-gb-icon>
<md-gb-icon style="--md-icon-size: 40px">star</md-gb-icon>
<md-gb-icon style="--md-icon-size: 48px">star</md-gb-icon>
```

## Weights

`--md-icon-wght` runs from 100 to 700.

**Example: Icons at weights 200, 400 and 700**

```html
<md-gb-icon style="--md-icon-wght: 200">star</md-gb-icon>
<md-gb-icon>star</md-gb-icon>
<md-gb-icon style="--md-icon-wght: 700">star</md-gb-icon>
```

## Fill

`--md-icon-fill` is 0 (outlined) or 1 (filled), and the change animates.

**Example: An outlined and a filled icon**

```html
<md-gb-icon>favorite</md-gb-icon>
<md-gb-icon style="--md-icon-fill: 1">favorite</md-gb-icon>
```

## Grades

`--md-icon-grad` adds emphasis when positive. It needs `GRAD` in the font
request.

**Example: Icons at grades -25, 0 and 200**

```html
<md-gb-icon style="--md-icon-grad: -25">star</md-gb-icon>
<md-gb-icon>star</md-gb-icon>
<md-gb-icon style="--md-icon-grad: 200">star</md-gb-icon>
```
