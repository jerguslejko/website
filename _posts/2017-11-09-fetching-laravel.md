---
title: "Fetching Laravel"
layout: post
---

**What?** Last night, shamelessly enough, I spent about 3 hours figuring this out. I was working on a Laravel site that has a concept of "companies". The `companies.index` view simply lists all companies in the database (_no pagination_). I wanted to add a search functionality that would update the HTML table as the user types in the query.

## Issue

When I was sending an AJAX request using the fancy `fetch()` API, Laravel would respond with `404` without any particular reason. I did not query an API route, neither did I use the `api` middleware group. I just wanted to use the same _session-based authentication_ that I already had in place.

## Solution

Turns out, the `fetch()` API does not attach cookies to the request by default. Laravel was receiving a request which could not be identified (no cookies = no session identifier), therefore was not able to recognise the logged in user. In order to send the cookies along with the request, you need to set `credentials: 'same-origin'` in the fetch's configuration object. The call looks like this:

```js
fetch(url, {
    credentials: 'same-origin',
})
```

Now, the request will contain the necessary cookies and the Laravel authentication system will be able to identify the user. 🎉
