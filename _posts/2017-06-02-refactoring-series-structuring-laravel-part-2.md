---
title: "Refactoring series: Structuring Laravel - Part 2"
layout: post
---

Hey! The second part of this article is a step-by-step tutorial on how to organize your Laravel app and make use of `App\Support` namespace. [Previous post]({{ site.baseurl }}{% post_url 2017-05-04-refactoring-series-structuring-laravel-part-1 %}#support-the-support-namespace) talks about advantages of this approach is available here. I want to emphasize that I **do not** use this approach in every app. I reach for it, when the out-of-box structuring feels bloated.

All framework-related classes in the `app` folder have to be registered in the framework. Controllers are registered in the routes file, middlewares are registered in `App\Http\Kernel`, console commands are in `App\Console\Kernel` and providers are registered in the `config/app.php` file. This post covers how to move individual files and update the reference.

OK, when you install a new Laravel project, the `app` folder looks like this:
```
app
├── Console
│   └── Kernel.php
├── Exceptions
│   └── Handler.php
├── Http
│   ├── Controllers
│   │   ├── Auth
│   │   └── Controller.php
│   ├── Middleware
│   │   ├── EncryptCookies.php
│   │   ├── RedirectIfAuthenticated.php
│   │   ├── TrimStrings.php
│   │   └── VerifyCsrfToken.php
│   └── Kernel.php
├── Providers
│   ├── AppServiceProvider.php
│   ├── AuthServiceProvider.php
│   ├── BroadcastServiceProvider.php
│   ├── EventServiceProvider.php
│   └── RouteServiceProvider.php
└── User.php
```

The goal of this tutorial, is to move "the code I do not want" to `App\Support` namespace. The rationale behind this is included in the previous post.

## 1. Moving Providers directory

1. move the folder (and its contents) from `app/Providers` to `app/Support/Providers`
1. change namespace in every provider from `App\Providers` to `App\Support\Providers`
1. update namespaces in `config/app.php` in the _providers_ sections

That's it. As the `app` folder follows PSR-4 autoloading standard, moving files and updating namespaces is all you need to do.

The `app` folder now looks like this:
```
app
├── Console
│   └── Kernel.php
├── Exceptions
│   └── Handler.php
├── Http
│   ├── Controllers
│   │   ├── Auth
│   │   └── Controller.php
│   ├── Middleware
│   │   ├── EncryptCookies.php
│   │   ├── RedirectIfAuthenticated.php
│   │   ├── TrimStrings.php
│   │   └── VerifyCsrfToken.php
│   └── Kernel.php
├── Support
│   └── Providers
│       ├── AppServiceProvider.php
│       ├── AuthServiceProvider.php
│       ├── BroadcastServiceProvider.php
│       ├── EventServiceProvider.php
│       └── RouteServiceProvider.php
└── User.php
```

## 2. Moving `Console\Kernel`, `Http\Kernel` and `Exceptions\Handler`

As mentioned above, all framework-related classes need to be registered, so Laravel knows where to look for them. These three _"core"_ classes are registered in the `bootstrap/app.php` file. If you open this file and scroll down a bit, you will see this piece of code:

```php
<?php

// ...

$app->singleton(
    Illuminate\Contracts\Http\Kernel::class,
    App\Http\Kernel::class
);

$app->singleton(
    Illuminate\Contracts\Console\Kernel::class,
    App\Console\Kernel::class
);

$app->singleton(
    Illuminate\Contracts\Debug\ExceptionHandler::class,
    App\Exceptions\Handler::class
);

// ...
```

To move `App\Http\Kernel` into the `App\Support` namespace, follow these steps (same steps apply for all three files):

1. move the file to the `app/Support/Http` folder
1. change the namespace from `App\Http` to `App\Support\Http`
1. update the namespace in the `bootstrap/app.php` file

Repeat these steps for `App\Console\Kernel` and `App\Exceptions\Handler`, and you will end up with a structure that looks like this:

```
app
├── Http
│   ├── Controllers
│   │   ├── Auth
│   │   └── Controller.php
│   └── Middleware
│       ├── EncryptCookies.php
│       ├── RedirectIfAuthenticated.php
│       ├── TrimStrings.php
│       └── VerifyCsrfToken.php
├── Support
│   ├── Console
│   │   └── Kernel.php
│   ├── Exceptions
│   │   └── Handler.php
│   ├── Http
│   │   └── Kernel.php
│   └── Providers
│       ├── AppServiceProvider.php
│       ├── AuthServiceProvider.php
│       ├── BroadcastServiceProvider.php
│       ├── EventServiceProvider.php
│       └── RouteServiceProvider.php
└── User.php
```

Neat, right?

## 3. Moving the rest

We are almost done at this point. If it was me, I would also move `App\Http\Controllers\Controller` to `App\Support\Http\Controller`. I like to keep the _"BaseClasses"_ inside the `Support` directory as well.

Next, you can move the middlewares. I tend to only move the ones that do not include any business logic, `VerifyCsrfToken` for example. When it comes to middlewares like `RedirectIfAuthenticated`, I tend to think differently. If the logic for authentication depends on a custom, project-specific functionality, it stays where it is. Otherwise it goes to the `Support` folder.

I will let you figure out the rest. Do you like having controllers in `App\Http\Controllers` or would you place them directly inside `App\Http`? Or maybe `App\Users\Controllers`? It's up to you.

---

By writing this post, I want to show that you can structure your app however you want (at least the `app` folder). **If it makes your app simpler or better, go for it!**
