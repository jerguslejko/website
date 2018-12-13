---
title: 'Memoization for fun and profit'
layout: post
---

**INTERIOR. LARAVEL APP - NIGHT - THINKING VERY HARD**

---

## The problem

I have a service which I create and bind to the container in a service provider. This service needs data which is stored in the database.

_So far so good._

The tricky bit is that the service is not used on every request therefore loading the data from the database every time would just slow down the app. Another not so straightforward issue is that the service requires the same data multiple times. _(Some **intuition about the mysterious service**: It's a "filter builder"; it needs a list of users twice since you can filter by users who created a model but also by users who edited it last)._

```php
<?php

// fetch the list of users
$users = User::all();

// "build" the service by registering a filter
// for "created_by" and another one for "updated_by"
$builder->filterBy('created_by', $users)
        ->filterBy('updated_by', $users);
```

To summarize, I need a way to provide the same data (list of users) to this service multiple times. The service might not be used during a given request, so the database queries should be executed lazily.

---

## Executing "lazily"

This one is easy. Just wrap everything in a closure. Instead of passing a list of users to the service, I'll pass a closure which, when executed, returns a list of users. This way I get around the issue of executing the queries when the service is not used.

```php
<?php

/**
 * Eager execution
 */

// users are fetched NOW
$users = User::all();

// here I provide a list of users to the filterBy method
$builder->filterBy('created_by', $users);

/**
 * Lazy execution
 */

// instead of passing an array of users the builder,
// I'll pass a closure which returns list of users
$builder->filterBy('created_by', function () {
    // users are fetched exactly when needed
    return User::all();
});
```

---

## Using the data multiple times

Alright. We have solved the issue of not fetching the data straight away. Now, how do we provide the same data to the service multiple times?

We could duplicate the closure.

```php
<?php

$builder
  ->filterBy('created_by', function () {
      return User::all();
  })
  ->filterBy('updated_by', function () {
      return User::all();
  });
```

However, since there are two closures, this code would produce two database queries. **NOT GOOD**.

Would extracting the closure to a variable and passing-in the variable instead help?

```php
<?php

$users = function () {
    return User::all();
};

$builder
  ->filterBy('created_by', $users)
  ->filterBy('updated_by', $users);
```

Unfortunately, no, it would not. The function gets executed twice, therefore two queries are produced again.

## Using memoization for fun and profit

Memoization is a technique where you modify a function (in our case the closure which returns a list of users) in such fashion that calling it for the first time makes it remember ("memoize") the output. When it's called the second time, the function returns the memoized output without actually running the body of the function.

OK WHAT. Look:

```php
<?php

function memoize(callable $fn): callable
{
    return function (...$args) use ($fn) {
        static $result = null;
        static $executed = false;

        if (! $executed) {
            $result = $fn(...$args);

            $executed = true;
        }

        return $result;
    };
}
```

This magical mess wraps our function in yet another function, which has "static context". The static context means that values of `$result` and `$executed` are preserved between calls. This allows us to "remember" whether the function has already been called (using the `$executed` variable) and it's return value (using the `$result` variable).

Let's look at how our "filter builder" looks when using this `memoize` helper.

```php
<?php

// we create a single closure and "enhance it" using the "memoize" helper
$users = memoize(function () {
    return User::all();
});

// we pass the closure to the builder twice
$builder
  ->filterBy('created_by', $users)
  ->filterBy('updated_by', $users);
```

Let's see how we are doing on the initial requirements:

-   database queries should not be executed when not using the service - **SATISFIED** - since we are providing functions instead of values, we do not have this issue
-   using the value multiple times should not make us query it multiple times - **SATISFIED** - memoizing the closure makes sure that the query is only executed once

## That's it.

By using the `memoize` helper we have managed to avoid creating complex abstractions to achieve the same feature.

What do you think? If you have any opinions about this, positive or negative, make sure to shout at me on [twitter](https://twitter.com/@jerguslejko) or you can [mail me](mailto:jergus.lejko@gmail.com)!

Also, well done for making it this far! Cheers ✌️
