---
title: "Refactoring series: Checkboxes & Timestamps"
layout: post
---

In a project I'm currently working on, I was tasked to add a new `is_archived` flag to the `Order` model. The project uses Angular and Laravel. Easy thing to do, just add a boolean column and a single checkbox. Or maybe there is more to it?

The thing is, sometimes I like to use timestamps instead of simple boolean fields. It allows me to store additional information about when the order was archived. The implementation is pretty simple. If the timestamp is `NULL`, the order is not archived. If it does have a value, it is archived.

However, passing a timestamp to Angular, when it expects a boolean is _really_ cumbersome. Therefore, I simply cast the timestamp (string) to a boolean. At this point, the database field was named `archived_at` and the field that Angular was working with (cast representation of the timestamp) was named `is_archived`.

The issue arose when I was trying to convert the boolean, coming from Angular to the timestamp. I did not want to update the timestamp if it was already set. This is what I came up with:

```php
<?php

public function update(Request $request)
{
    // ...

    $order->fill(
        $request->only('customer_id', 'product_id')
    );

    if ($request->is_archived && ! $order->archived_at) {
        $order->archived_at = Carbon::now();
    }

    if (! $request->is_archived && $order->archived_at) {
        $order->archived_at = null;
    }

    // ...
}
```

Works great but the implementation is too heavy. I would like to hide this bit of code and automate it as much as possible. This can be done by leveraging [Eloquent Mutators](https://laravel.com/docs/5.4/eloquent-mutators#accessors-and-mutators) that Laravel provides.

If I take that approach, the controller method can be simplified to this:

```php
<?php

public function update(Request $request)
{
    // ...

    $order->fill(
        $request->only('customer_id', 'product_id', 'is_archived')
    );

    // ...
}
```

The mutator method will be called automatically under the hood.

```php
<?php

public function setIsArchivedAttribute($is_archived)
{
    if ($is_archived && ! $this->archived_at) {
        $this->attributes['archived_at'] = Carbon::now();
    }

    if (! $is_archived && $this->archived_at) {
        $this->attributes['archived_at'] = null;
    }
}
```

This bit of magic allows me to work with booleans on the frontend, store the additional information in the database and pull the logic of converting a boolean to a timestamp outside of the controller.

I must note that I'm just trying out this approach. Therefore, if you have a well-formed opinion about this, make sure to let me know!
