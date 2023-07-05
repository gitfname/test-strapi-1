module.exports = {
    routes: [
      {
        method: "GET",
        path: "/musics/get-top-10",
        handler: "music.getTop10",
      },
      {
        method: "GET",
        path: "/musics/get-top-15-singers",
        handler: "music.getTop15Singers",
      },
      {
        method: "GET",
        path: "/musics/getTop7UpcomingMusics",
        handler: "music.getTop7UpcomingMusics",
      },
    ],
};