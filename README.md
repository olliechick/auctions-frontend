# Auction app

An app for buying and selling, using auctions.

There is a live version at [olliechick.me/auctions](http://olliechick.me/auctions). Alternatively, you can run it yourself:

## Build setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080 - note that you have to go to localhost:8080/auctions
npm run dev

# build for production with minification
npm run build
```

> For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Backend

The backend is hosted on a free Heroku server which deploys from a private GitHub repo (which is why is can sometimes take a few seconds to retrieve the data). I can't publish this repo, as it was written by one of the tutors for the course. The [backend I developed](https://github.com/olliechick/auctions-backend-deprecated) is slightly different; we all developed our frontends off the tutor's backend in the course for consistency.
