---
title: "Refactoring series: Confusing controllers"
layout: post
---

**Introduction to the series:** Posts marked with _Refactoring series_ talk about past refactorings I have performed on my projects. I'll try to go through the decisions I made and explain why I think they were the best at the moment. These posts will probably be short and very focused.

---

**Scene:** Laravel app that serves as an API for an Angular frontend.

# The issue
The app has around 20 resources (entities/models) and it needs to provide CRUD endpoints for every one of them. While most of the resources support all four of these actions, some do not need the `index()` method. Their content is nested in another resource.

The controllers in this app are fairly simple as they just get the data from a repository and pass into an appropriate transformer. This allows me to extract the methods to a parent class.

I'll provide examples for `CompaniesController` and its implementation using each solution.

## First solution: Abstract ~~ApiController~~ ~~CrudController~~ BaseController

This approach is very simple and I'd say that you are most likely to see this pattern in any Laravel API project.


```php
<?php

// ...

abstract class BaseController
{
    public function index()
    {
        return $this->transformer->collection(
            $this->repository->all()
        );
    }

    // create(), update(), destroy()
}
```

The `CompaniesController` would inject a transformer and a repository in its constructor and simply delegate the rest of functionality to the `BaseController` class.

```php
<?php

// ...

class CompaniesController extends BaseController
{
    public function __construct(CompaniesRepository $repository, CompaniesTransformer $transformer)
    {
        $this->repository = $repository;
        $this->transformer = $transformer;
    }
}
```

This implementation is nice and simple. However there are some issues which I couldn't overcome.

The app has couple controllers which do not fall under the CRUD schema. Having `create()` method does not make sense in their context. An example of such controller would be `LoginController`. Extending the `BaseController` would feel **really weird** in this case.

It could extend the `Illuminate\Http\Controller` directly, but that brings a bit of confusion in my opinion. I don't want any of my controllers to extend the framework's `Controller` class when I'm providing a layer that talks to it.

**Composition to save the day!**

## Second solution: RestfulMethods trait

Instead of extending `BaseController`, I moved all relevant methods to a `RestfulMethods` trait. All controllers then extended the `Illuminate\Http\Controller` directly and this trait was imported only in the ones that provide the CRUD methods.

```php
<?php

// ...

trait RestfulMethods
{
    public function index()
    {
        return $this->transformer->collection(
            $this->repository->all()
        );
    }

    // create(), update(), destroy()
}
```

And the `CompaniesController` looked like this:

```php
<?php

// ...

use Illuminate\Http\Controller;

class CompaniesController extend Controller
{
    use RestfulMethods;

    public function __construct(CompaniesRepository $repository, CompaniesTransformer $transformer)
    {
        $this->repository = $repository;
        $this->transformer = $transformer;
    }
}
```

This removed the confusion between extending custom `BaseController` and framework's `Controller` class.

It's a small change, but I believe that it makes a difference big enough to be implemented.

**Done? Nope.**

Remember how I told you that some resources do not need the `index()` method? Any controller that imports the `RestfulMethods` trait, will import this method as well. This may not seem like a huge issue at first, however, imagine I would implement a route for this method by mistake. A new endpoint would exist and a chance of me using it on the Angular part would be pretty high.

**Not good enough!**

## Third solution: A trait per method

I went ahead and split the `RestfulMethods` trait into smaller traits, each containing a single CRUD method. I ended up with four traits: `Methods\Index`, `Methods\Create`, `Methods\Update` and `Methods\Destroy`. By doing so, a controller can import just those methods that it actually requires.

Implementation of `Methods\Index`:

```php
<?php

// ...

trait Index
{
    public function index()
    {
        return $this->transformer->collection(
            $this->repository->all()
        );
    }
}
```

The `CompaniesController` simply imports the methods it needs:

```php
<?php

// ...

use App\Http\Methods;

class CompaniesController extend Controller
{
    use Methods\Index, Methods\Create, Methods\Update, Methods\Destroy;
}
```

## Yay!

I'm pretty satisfied with the result. It's simple, flexible and I actually think the `use` statement looks cool ✌️
