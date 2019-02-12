# "Safe PHP" research

## Usage

```shell
$ safe-php script.php
```

How does it work:
  - uses `php -l` to ensure correct syntax
  - parses the source file, analyzes it and reports the results
  - _if_ successfull _then_ proxy to `php` _else_ display errors/warnings
  
## Types

1. use native PHP types for simple cases
    ```php
    function foo(string $x): int
    {
      ....
    }
    ```
    
1. for unsupported types, use [phpDocumentor](https://www.phpdoc.org)
  ```php
  /**
   * @param string[] $xs
   *
   * @return int|\DateTime
   */
  function foo($xs)
  {
    ...
  }
  ```
  
1. **(?)** for types which are not supported by [phpDocumentor](https://www.phpdoc.org), extend the [phpDocumentor](https://www.phpdoc.org) syntax
  ```php
  /**
   * @return [int, string] Pseudo tuple type
   */
  function foo()
  {
    ...
  }
  ```
