module.exports = {
    routes: [
      {
        method: "GET",
        path: "/listening-history",
        handler: "listening-history.getListeningHistory",
      },
      {
        method: "PUT",
        path: "/listening-history",
        handler: "listening-history.addListeningHistory",
      },
      {
        method: "DELETE",
        path: "/listening-history",
        handler: "listening-history.deleteListeningHistory",
      },
    ],
};