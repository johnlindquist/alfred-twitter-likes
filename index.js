var Twitter = require("twitter")
let { startOfYesterday, isAfter } = require("date-fns")
require("dotenv").config()

let {
  consumer_key,
  consumer_secret,
  access_token_key,
  access_token_secret,
} = process.env

var client = new Twitter({
  consumer_key,
  consumer_secret,
  access_token_key,
  access_token_secret,
})

let getTweets = id_str => {
  var params = {
    count: 200,
    include_rts: false,
    max_id: id_str,
    tweet_mode: "extended",
    stringify_ids: true,
    screen_name: "johnlindquist",
  }
  client.get("favorites/list", params, function (
    error,
    tweets,
    response
  ) {
    let markdown = tweets
      // I only want recent Likes. I can probably cache the latest id or something 🤔
      .filter(tweet =>
        isAfter(
          new Date(tweet.created_at),
          startOfYesterday()
        )
      )
      .filter(
        tweet =>
          tweet.entities.urls && tweet.entities.urls.length
      )
      .reduce(
        // Template
        (acc, tweet) => `${acc}
* ${tweet.full_text} - [${tweet.user.name}](${
          tweet.user.url
        })
${tweet.entities.urls.map(
  url => `    * [${url.display_url}](${url.expanded_url})`
)}
`,
        ``
      )

    console.log(`## Likes ${markdown}`)
  })
}
getTweets()
