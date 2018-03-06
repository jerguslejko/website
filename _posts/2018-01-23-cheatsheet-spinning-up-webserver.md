---
title: "Cheatsheet: Spinning up a webserver"
layout: post
published: false
---

From time to time I have to spin up a new PHP web server to host a Laravel application and I constantly refer to the same set of articles I found online. This post is just me writing some stuff down, so I won't have to google it again. And what do you know, maybe you find it useful too.

I generally use [DigitalOcean](https://digitalocean.com) as a VPS provider and I usually stick to the cheapest 5$/month droplet option. As my OS of choice I always pick the latest `*.04` version of Ubuntu.

So, here it goes.

## Rough work

# put this into .bashrc

echo 'export LC_ALL="en_US.UTF-8"' >> /root/.bashrc
source ~/.bashrc

# create user

useradd --groups sudo,www-data --create-home --shell /bin/bash deploy
echo deploy:secret | chpasswd

echo 'export LC_ALL="en_US.UTF-8"' >> /home/deploy/.bashrc

# ssh keys for deploy user

su -c 'ssh-keygen -t rsa -b 4096 -f /home/deploy/.ssh/id_rsa -P "" -C "$(whoami)@$(hostname)"' deploy

su -c "echo '$(cat /root/.ssh/authorized_keys)' > /home/deploy/.ssh/authorized_keys" deploy

# sshd config

sed -i "s/PermitRootLogin yes/PermitRootLogin no/" /etc/ssh/sshd_config
service sshd restart

# packages

add-apt-repository -y ppa:ondrej/php
add-apt-repository -y ppa:ondrej/nginx
add-apt-repository -y ppa:certbot/certbot

apt update

# essentials

apt install -y build-essential

# nginx

apt install -y nginx
chown deploy:www-data -R /var/www/

# php

apt install -y php7.2-fpm php7.2-cli php7.2-mbstring php7.2-xml php7.2-zip php7.2-mysql

# composer

curl --silent --show-error https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# mysql

apt install -y mysql-server
mysql_secure_installation

# nodejs + yarn

curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" > /etc/apt/sources.list.d/yarn.list
curl -sL https://deb.nodesource.com/setup_9.x | bash -

apt install -y nodejs yarn

# nginx config from laravel docs

service nginx reload

# certbot

apt-get install -y software-properties-common python-certbot-nginx

# laravel

sudo chgrp -R www-data storage bootstrap/cache
sudo chmod -R ug+rwx storage bootstrap/cache

--------------------------------------------------------i

https://www.colinodell.com/blog/201711/installing-php-72
https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-16-04
https://certbot.eff.org/all-instructions/#ubuntu-16-04-xenial-nginx

## Notes

* setup the **deploy** user
* allow them to ssh in
* add them to the sudo group
* disallow ssh root login
* install php + extensions
* install composer
* install node, yarn
* install mysql
* install fail2ban, ufw

---

As I change my setup or discover a new shiny thing every single of my server must have, I will update this article.
