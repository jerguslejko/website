---
title: 'Test your morph map [in Laravel]'
layout: post
---

First of all, I need to say that I am a sucker for moving files and classes around. `App\Users\Group` is much nicer than `App\UserGroup`, sorry.

--

If you have ever used Laravel's [morph map](https://laravel.com/docs/5.7/eloquent-relationships#custom-polymorphic-types) feature, you might know that it's _really_ easy to forget to update the morph map once you move a model to a different namespace.

For reference, what I mean when I'm talking about **"morph map"**, I'm referring to the mapping between a model class name and a string, which represents the model on the database level.

```php
public function boot()
{
    Relation::morphMap([
        'comments'    => \App\Comment::class,
        'users'       => \App\Users\User::class,
        'user_groups' => \App\Users\Group::class,
    ]);
}
```

# What I came up with

Naturally, at first I tried to overcomplicate things and I made a `symfony/console`-based tool to scan the project, find the model files, find the morph map and do the math.

The second (and final I think) attempt, resulted in a much simpler solution. I used the same approach but instead of putting it into a separate tool, I've placed it inside a PHPUnit test. This is what it looks like:

```php
<?php

namespace Tests\Unit;

use App\Support\Utils;
use Tests\UnitTestCase;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;

class MorphMapTest extends UnitTestCase
{
    /** @test */
    public function it_includes_all_models()
    {
        $models = Utils::classesIn(app_path())
            ->filter(function ($class) {
                return $class->isSubclassOf(Model::class);
            })
            ->pluck('name');

        $map = collect(Relation::morphMap())
            ->values();

        $this->assertEmpty(
            $models->diff($map),
            'Morph map is missing these models: '.$models->diff($map)->implode(', ').'.'
        );

        $this->assertEmpty(
            $map->diff($models),
            'Morph map contains these extra models: '.$map->diff($models)->implode(', ').'.'
        );
    }
}
```

## How does this work?

The test gets a collection of models which live in the `/app` folder. Then it gets the morph map using `Illuminate\Database\Eloquent\Relations\Relation::morphMap()` call and coverts it into a collection.

Finally it compares the two collections and asserts that both diffs are empty. `$model->diff($map)` contains entries which are missing from the morph map. The inverse, `$map->diff($models)`, contains entries which are present in the morph map but point to a model which does not exist.

Almost there. I have left out one very important thing.

### How do you get the list of models?!

I've built a utility for this but it's kind of hacky.

```php
<?php

namespace App\Support;

use ReflectionClass;
use Symfony\Component\Finder\Finder;

class Utils
{
    public static function classesIn(string $path)
    {
        foreach (Finder::create()->files()->in($path) as $file) {
            require_once $file->getPathname();
        }

        return collect(get_declared_classes())
            ->map(function ($class) {
                return new ReflectionClass($class);
            })
            ->reject(function ($class) {
                return $class->isAnonymous();
            })
            ->filter(function ($class) use ($path) {
                return starts_with($class->getFileName(), $path);
            })
            ->values();
    }
}
```

Cool, right? The utility first `require`s all files within the `/app` folder. Then it gets the list of declared classes, filters it to non-anonymous ones which live in the `/app` folder. Hacky but works.

What do you think?
