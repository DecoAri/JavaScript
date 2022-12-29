/*
建议cron：1 0 * * *
相比于rsshub来说，信息来自官网，更新更及时
QX的js请去Quantumult X的文件夹路径寻找
*/



$httpClient.get({url:"https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=US&allowCountries=US"}, function(error,resp,body) {
  let jsonBody = JSON.parse(body)
  let i = 0
  let games = jsonBody.data.Catalog.searchStore.elements
  while (games) {
    if (jsonBody.data.Catalog.searchStore.elements[i] == undefined) {
      break;
    } else if (jsonBody.data.Catalog.searchStore.elements[i].title == "Mystery Game") {
      i++
    } else {
      games = jsonBody.data.Catalog.searchStore.elements[i]
      console.log(games)
      if (games.promotions == null) {
        $notification.post('🎮EPIC:   ' + games.title, '🕒UPCOMING: ' + 'UNKNOWN', '📜DESCRIPTION: ' + games.description, {url:games.keyImages[1].url})
        i++
      } else if (games.promotions.upcomingPromotionalOffers == '') {
        $notification.post('🎮EPIC:   ' + games.title, '🕒OPEN: ' + transFormTime(games.promotions.promotionalOffers[0].promotionalOffers[0].startDate) + '\n🕐END:    ' + transFormTime(games.promotions.promotionalOffers[0].promotionalOffers[0].endDate), '📜DESCRIPTION: ' + games.description, {url:games.keyImages[1].url})
        i++
      } else {
        $notification.post('🎮EPIC:   ' + games.title, '🕒UPCOMING: ' + transFormTime(games.promotions.upcomingPromotionalOffers[0].promotionalOffers[0].startDate) + '\n🕐END:    ' + transFormTime(games.promotions.upcomingPromotionalOffers[0].promotionalOffers[0].endDate), '📜DESCRIPTION: ' + games.description, {url:games.keyImages[1].url})
        i++
      }
    }
  }
  $done()
})

function transFormTime(times) {
    const date = new Date(times);
    return `${date.getFullYear()}Y-${
        date.getMonth() + 1
    }M-${date.getDate()}D-${date.getHours()}H`;
}