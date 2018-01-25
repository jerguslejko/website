---
title: "Tip: Shell aliases with sudo"
layout: post
---

Here is a quick tip for you.

Have you ever tried using your shell aliases in combination with the `sudo` command? Yeah, does not work. The reason being that shell aliases are a simple 'text substitution' mechanism and by default, only the first word in a command is checked to see if it has an alias. However, if the last character of an alias is a space, the following word is also checked for alias expansion.

## The Trick

In order to use your aliases when using `sudo`, you need to create an alias for the `sudo` command itself. Aliasing it to `sudo ` (that's `sudo` + `<space>`) will force the following word to be evaluated as an alias as well.

```shell
alias sudo="sudo "
```

## Example

```bash
$ alias show-logs="cat /var/log/nginx/access.log"

$ show-logs
cat: /var/log/nginx/access.log: Permission denied

$ sudo show-logs
sudo: show-logs: command not found

$ alias sudo="sudo "

$ sudo show-logs
20.20.20.20 - - [24/Jan/2018:22:48:12+0000] "GET / HTTP/1.1" 301 194 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36"
.
.
.
```

More detailed description of how alias expansion works can be found in the [Bash Reference Manual](http://www.gnu.org/software/bash/manual/bashref.html#Aliases).

Neat, right? That's it. Bye bye 👋
