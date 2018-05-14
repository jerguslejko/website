---
title: "Vim Tip: Relative line numbers"
layout: post
---

**Introduction to the series**: I'm learning **vim** & documenting any struggles along the way. (I've been using it for 3 years now, AND I STILL SUCK AT IT).

---

By default, in vim, you don't get any line numbers. To enable this "feature", you need to put `set number` into your `.vimrc`. Or type it in every time you want see what line you're on ¯\\_(ツ)_/¯. This gives you "absolute line numbers" (the first line is marked as `1`, the second line is marked as `2` and so on). Cool.

Once you start to feel, you're *vim-ninja-ness™* is going up, absolute line numbers are no longer an option.

## Relative line numbers

**First of all**, why would you want to use this? Relative line numbers are super useful for jumping around in vim. Say I want to jump 5 lines up. I can do `5k` in normal mode. However, how do I know, how many lines to jump? Do you count them by hand? No. You use **relative line numbers**.

> You can enable it by using the `set relativenumber` command.

This feature marks every line using a relative offset from the current line. Eg. if you are on line 32, line 31 is marked as `1`, line 30 is marked as `2` etc. Same goes for the other direction. Line 33 is `1`, line 34 is `2`.

```
  5 {
  4     "tabWidth": 4,
  3     "useTabs": false,
  2     "semi": true,
  1     "singleQuote": true,
> 0     "trailingComma": "all",
  1     "bracketSpacing": true,
  2     "arrowParens": "always",
  3     "printWidth": 100
  4 }
```

In the example above, I'm on line marked as `0`. Now let's say I want to change the value of `tabWidth`. I see that the line is "4 lines up", so I can simply do `4k` in normal mode and I'm there!

## Hybrid mode

If you use `set number` and `set relativenumber` at the same time, current line will be marked using absolute position and the rest of the lines will be marked relatively. Resulting in:

```
  5 {
  4     "tabWidth": 4,
  3     "useTabs": false,
  2     "semi": true,
  1     "singleQuote": true,
6       "trailingComma": "all",
  1     "bracketSpacing": true,
  2     "arrowParens": "always",
  3     "printWidth": 100
  4 }
```

This way you always know what line you're on, and can jump around like a true _vim-ninja™_.

Cheers ✌️
