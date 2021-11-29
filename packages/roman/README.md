# @umbrellajs/roman - Roman numeral converter

Roman numeral parser, which supports unsigned integers between a range of 1..3999.

## Features

_roman_: function to change a decimal number into a roman numeral format.
_arabic_: function to change a roman numeral into an arabic decimal format.

## Usage

### Decimals to Roman numerals

The `roman` function can be used to change any unsigned integer between 1..3999 to a roman numeral format.

```ts
import { roman } from "@umbrellajs/roman";

roman(4); // -> "IV"
roman(3999); // -> "MMMCMXCIX"
```

### Roman numerals into arabic decimals

The `arabic` function can be used to change a roman numeral into a decimal format.

```ts
import { arabic } from "@umbrellajs/roman";

arabic("IV"); // -> 4
arabic("MMMCMXCIX"); // -> 3999
```
