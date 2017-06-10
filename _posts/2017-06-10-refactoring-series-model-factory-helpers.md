---
title: "Refactoring series: Model Factory Helpers"
---

**Hot off the press.** I committed this 20 minutes ago.

I was working on an application that has around ~20 models. It makes a huge use of [Model Factories](https://laravel.com/docs/5.4/database-testing#writing-factories) since they are **so** amazing!

For example, `OrdersFactory` looks like this _(simplified)_:

```php
<?php

$factory->define(App\Order::class, function (Faker\Generator $faker) {
    return [
        'date_from'   => Carbon::now()->subDays(5),
        'date_to'     => Carbon::now()->addDays(5),

        'note'        => $faker->sentence,

        'agent_id'    => function () {
            return App\Agent::first()->id ?? factory(App\Agent::class)->create()->id;
        },
        'customer_id' => function () {
            return App\Customer::first()->id ?? factory(App\Customer::class)->create()->id;
        },
    ];
});
```

Take a look at `'agent_id'` and `'customer_id'` bits. They are almost identical. It first tries to fetch an existing model. If it cannot find one, it uses `factory()` helper to create a new instance. While this solution is alright, in the app, there are 20-30 places where I had to write out this closure.

# Idea

I like the idea of _Programming by Wishful Thinking_. So I tried to design an API I would like. Here is what I came up with:

```php
<?php

// Instead of writing out the closure every time,
'customer_id' => function () {
    return App\Customer::first()->id ?? factory(App\Customer::class)->create()->id;
},

// I would love to write this:
'customer_id' => factory(App\Customer::class)->firstOrCreate(),
```

# Solution

Since extending `Illuminate\Database\Eloquent\FactoryBuilder` is not an option, I realized I could make use of Laravel's `Macroable` trait. However, this class did not import the trait at the time.

Out of luck? Not really.

I went ahead and submitted [this PR](https://github.com/laravel/framework/pull/19425). It was accepted the same day and I was just waiting for the next release.

# Result

The implementation of this "feature" is super simple. In a service provider, I now register this macro:

```php
<?php

public function register()
{
    FactoryBuilder::macro('firstOrCreate', function () {
        return function () {
            // $this refers to Illuminate\Database\Eloquent\FactoryBuilder instance.

            return $this->class::first()->id ?? factory($this->class)->create()->id;
        };
    });
}
```

And the new, nice and shiny `OrdersFactory` is born:

```php
<?php

$factory->define(App\Order::class, function (Faker\Generator $faker) {
    return [
        'date_from'   => Carbon::now()->subDays(5),
        'date_to'     => Carbon::now()->addDays(5),

        'note'        => $faker->sentence,

        'agent_id'    => factory(App\Agent::class)->firstOrCreate(),
        'customer_id' => factory(App\Customer::class)->firstOrCreate(),
    ];
});
```

---

**Outcome?** Super small change. Super nice result.
