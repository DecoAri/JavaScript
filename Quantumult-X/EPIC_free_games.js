
/**
建议cron：0 0 * * *
surge脚本请去surge文件夹路径寻找
*/


$task.fetch({url:"https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=US&allowCountries=US"}).then(response => {
  let jsonData = JSON.parse(response.body)
  let i = 0
  let games = jsonData.data.Catalog.searchStore.elements
  while (games) {
    if (jsonData.data.Catalog.searchStore.elements[i].title == "Mystery Game") {
      break;
    } else {
      games = jsonData.data.Catalog.searchStore.elements[i]
      console.log(JSON.stringify(games))
      $notify('🎮EPIC:   ' + games.title, '🕒OPEN: ' + transFormTime(games.promotions.promotionalOffers[0].promotionalOffers[0].startDate) + '\n🕐END:    ' + transFormTime(games.promotions.promotionalOffers[0].promotionalOffers[0].endDate), '📜DESCRIPTION: ' + games.description, {"media-url":games.keyImages[1].url})
      i++
    }
  }
  $done()
}, reason => {
  // reason.error
  $notify("EPIC FREE GAMES", "ERROR", reason.error); // Error!
  $done();
});


function transFormTime(times) {
    const date = new Date(times);
    return `${date.getFullYear()}Y-${
        date.getMonth() + 1
    }M-${date.getDate()}D-${date.getHours()}H`;
}
