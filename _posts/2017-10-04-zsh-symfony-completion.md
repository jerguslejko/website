---
title: "(Oh My) ZSH Symfony Completion"
layout: post
---

I am presenting you with my own Oh My Zsh plugin that brings command line autocompletion to your favorite tools such as `laravel/artisan`, `laravel/valet`, `composer` or ANY other command line tool built on `symfony/console`!

Follow [the instructions](https://github.com/jerguslejko/zsh-symfony-completion) on Github and bring life to your command line!

## Backstory: How & Why

I am a huge fan of [Oh My Zsh](https://github.com/robbyrussell/oh-my-zsh) and a huge fan of Laravel. When I switched to Oh My Zsh, I have immediately fallen in love with "autocompletion plugins" for various tools such as `git` or `brew`. However, I was missing this functionality in tools I was using on daily basis: `artisan` and `composer`.

I have googled for suitable plugins but I was not totally satisfied with the ones I found. They were either outdated (new commands missing) or offered only fixed set of commands (it wouldn't pick up your custom artisan commands). I decided to take a look at how are these plugins structured and come up with a new one that would cover all my needs.

My first goal was to create an "Artisan completion plugin" that would parse the output of `php artisan` and provide me with fully functional autocompletion. I managed to get the prototype working in a few hours and I was pretty happy with the result. Then is struck me! Laravel's `artisan` is built on top of the `symfony/console` package. And so is `composer`!

I decided to generalize this plugin to support ANY tool built on `symfony/console`. That includes `laravel/installer` or even `laravel/valet`! To activate the autocompletion for your favorite tools, just specify the name of the tool in `.zshrc`. Take a look at [the Github repository](https://github.com/jerguslejko/zsh-symfony-completion#instalation) for further instructions.

So, here we are. Go ahead, try it and let me know what you think. Thanks.
