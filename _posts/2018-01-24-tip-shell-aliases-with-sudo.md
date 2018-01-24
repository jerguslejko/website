---
title: "Tip: Shell aliases with sudo"
layout: post
---

Here is a quick tip for you.

Have you ever tried using your shell aliases in combination with the `sudo` command? Yeah, does not work. The reason being that `sudo` simulates root's environment and since shell aliases are local to the user, they are not available when using `sudo`.

## The Trick

The way to work around this issue is to use a very neat trick. You need to alias the `sudo` command to `sudo ` (that's `sudo` + `<space>`).

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

Neat, right? That's it. Bye bye 👋
