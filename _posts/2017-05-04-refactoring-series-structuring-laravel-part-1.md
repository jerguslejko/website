---
title: "Refactoring series: Structuring Laravel - Part 1"
layout: post
---

Every time I start a new Laravel project, I take a little time to decide on how I want to structure it. Since Laravel allows me to organize the folders however I want, I have come up with a couple different approaches to tackle this.

## Everything lives in the App namespace

The first approach I have taken was simply to put all files into the `App` namespace. I placed everything next to the `Providers` and `Console` folders. If I needed a place for _Jobs_ or _Presenters_, I simply created a new folder right in the `App` namespace. While this is **PERFECTLY FINE**, it might get a little messy as the project grows.

**Please note, I still use THIS kind of structure in most of my apps.**

The project contained a lot of classes related to _Users_, therefore I moved them into `App\Users` namespace.

For me, it feels a bit weird for the `app` folder to contain `Users` folder, which represents domain objects (your models, jobs, etc), along with `Providers` folder, which provides a "framework-necessary bootstrap" such as `RouteServiceProvider`.

```
# The folder structure using the first approach

app
├── Console
│   └── Kernel.php
├── Exceptions
│   └── Handler.php
├── Http
│   ├── Controllers
│   ├── Middleware
│   └── Kernel.php
├── Jobs
│   └── RegisterUser.php
├── Presenters
│   └── ProfilePresenter.php
├── Providers
│   ├── AppServiceProvider.php
│   ├── RouteServiceProvider.php
└── Users
    └── User.php
```

## Domain logic lives in a dedicated folder

To avoid having all classes under the same namespace, I decided to move the domain objects into a dedicated folder. They would all live in a namespace like this: `App\Acme`.

OK, this solves the problem, doesn't it? The domain logic and the "framework-necessary bootstrap" are separated.

**However**, I did not like that my domain logic, **the thing that matters the most**, is nested inside `App\Acme`. It makes the impression that code placed in the `App` namespace, is somehow more important than the domain logic.

```
# The folder structure using the second approach

app
├── Acme
│   ├── Jobs
│   │   └── RegisterUser.php
│   ├── Presenters
│   │   └── ProfilePresenter.php
│   └── Users
│       └── User.php
├── Console
│   └── Kernel.php
├── Exceptions
│   └── Handler.php
├── Http
│   ├── Controllers
│   ├── Middleware
│   └── Kernel.php
└── Providers
    ├── AppServiceProvider.php
    └── RouteServiceProvider.php
```

Let's reverse this.

## Support the `Support` namespace!

The final approach I came up with was to move the "framework-necessary bootstrap" into `App\Support` namespace. Instead of "hiding" the domain code, I'll hide the code I do not really want to have.

This enabled me to move every domain related class a level up. Now, the `User` class is accessible at `App\Users\User` instead of `App\Acme\Users\User`!

```
# The folder structure using the third approach

app
├── Http
│   ├── Controllers
│   └── Middleware
├── Jobs
│   └── RegisterUser.php
├── Presenters
│   └── ProfilePresenter.php
├── Support
│   ├── Console
│   │   └── Kernel.php
│   ├── Exceptions
│   │   └── Handler.php
│   ├── Http
│   │   └── Kernel.php
│   └── Providers
│       ├── AppServiceProvider.php
│       └── RouteServiceProvider.php
└── Users
    └── User.php
```

Easy right? Well, moving the `App\Console\Kernel`, `App\Http\Kernel` or `App\Exceptions\Handler` classes is not as seamless as moving the domain code. Therefore, I'll dedicate my next post to a tutorial on how to push the "necessary" code into `App\Support` namespace.
