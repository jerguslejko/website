---
title: "Web Developer without a Web server"
---

Recently, I have **FALLEN IN LOVE** with [Jekyll](https://jekyllrb.com/). Yeah, I know that I'm late to the party.

I really like the idea of Static Site Generators. So, of course, I have converted all my personal sites to a Jekyll site. This blog, the main site, and my resumé. I just love the simplicity. Work locally, deploy simple plain HTML files. ❤️.

For the past few months (a year of two), I had a [DigitalOcean](https://digitalocean.com) droplet powering all my websites. It worked great, I learned a lot about Linux, Nginx, DNS, etc. Anyway, it felt kind of heavy to setup Debian or Ubuntu, configure Nginx, setup PHP, firewall, ssh, fail2ban just for the purpose of having three simple _static_ (Jekyll powered) sites.

Then, I have discovered [Github Pages](https://pages.github.com). Yaaaay 🎉🎉🎉. Late to the party again. Simple and effective way to host my sites. The most amazing thing about Github Pages is the deployment process. It consists of a single step: Push to Github. DONE. Github will automatically trigger Jekyll build and update the site. Amazing.

The last issue was SLL certificates. Github pages offer free SSL certs only when you use Github Pages URLs. I didn't like that, so I googled for a solution. A few minutes later, I found out about [Cloudflare](https://www.cloudflare.com). Once again, **LATE TO THE PARTY**. It took me an hour or so to configure it. Okay, I'm lying. It took me like 5 hours because I had no idea what I was doing.

Finally, I figured it out. Changed DNS Name Servers to point to Cloudflare, setup the domain at Github's end and voilà, here we are!

I must add, everything, apart from purchasing my domain, IS FOR FREE. Github Pages and Cloudflare for $0/£0/0€.

Ok, that's it. Bye bye 🌵
