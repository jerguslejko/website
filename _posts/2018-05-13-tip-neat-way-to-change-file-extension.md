---
title: "Tip: A neat way to change file extension"
layout: post
---

Recently, I discovered a very neat way to change a file extension using command line. This trick makes use of [Shell parameter expansion](https://www.gnu.org/software/bash/manual/html_node/Shell-Parameter-Expansion.html) which works in `bash`, `zsh`, even in `sh`! Basically anywhere.

## Example

Imagine you want to rename `file.sh` to `file.zsh`. Using the parameter expansion, you can type:

```bash
mv file.{sh,zsh}
```

which gets expanded to:

```bash
mv file.sh file.zsh
```

Neat, right? Here are some other example of using this feature:

```shell
# using enumeration
echo file-{a,b,c} # echo file-a file-b file-c

# using range
echo file-{1..4} # echo file-1 file-2 file-3 file-4

# removing extension
mv file{.txt,} # mv file.txt file
```

Cheers ✌️
