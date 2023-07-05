const max_listening_history_length = 15

function checkUserId(query) {
    const userId = query?.userId
    ?
        parseInt(query.userId)
    :
        false
    
    if(!userId) throw Error("userId is not found")

    return userId
}

function checkQueryParams(query, requiredParams) {
    const params = {}

    requiredParams.forEach(param => {
        if(query[param]) {
            params[param] = query[param]
        }
        else {
            throw Error(`${param} not found`)
        }
    })

    return params
}


module.exports = {
    async getListeningHistory(ctx) {
        try {
            const { userId } = checkQueryParams(ctx.query, ["userId"])

            const listeningHistory = (await strapi.entityService.findOne("plugin::users-permissions.user", userId, {
                fields: ["id", "recently_played_musics"]
            }))["recently_played_musics"]

            const getListenedMusicsDetailsPromises = listeningHistory.map(musicId => {
                return strapi.entityService.findOne("api::music.music", musicId, {
                    fields: ["id", "name"],
                    populate: {
                        image: {
                            fields: ["id", "name", "url", "mime"]
                        },
                        music: {
                            fields: ["id", "name", "url", "size", "mime"]
                        },
                        likes: {
                            fields: ["id", "like"]
                        },
                        music_comments: {
                            fields: ["id"]
                        }
                    }
                })
            })

            let result = 0

            await Promise.all(getListenedMusicsDetailsPromises)
                .then(res => {
                    result = res
                })
                .catch(err => {
                    throw Error("something went wrong while getting listened music details")
                })

            ctx.body = result
        }
        catch(err) {
            console.log(err);
            ctx.body = "something went wrong"
        }
    },

    async addListeningHistory(ctx) {
        try {
            const {userId, musicId} = checkQueryParams(ctx.query, ["userId", "musicId"])

            const currentListeningHistory = await strapi.entityService.findOne("plugin::users-permissions.user", userId, {
                fields: ["id", "recently_played_musics"]
            })

            const newListeningHistory = [
                musicId,
                ...currentListeningHistory["recently_played_musics"]
            ]

            if(newListeningHistory.length > max_listening_history_length) newListeningHistory.pop()

            const updateResult = await strapi.entityService.update("plugin::users-permissions.user", userId, {
                fields: ["id", "username", "recently_played_musics"],
                data: {
                    recently_played_musics: newListeningHistory
                }
            })

            ctx.body = updateResult
        }
        catch(err) {
            console.log(err);
            ctx.body = "something went wrong"
        }
    },

    async deleteListeningHistory(ctx) {
        const { userId, musicId } = checkQueryParams(ctx.query, ["userId", "musicId"])

        const currentListeningHistory = await strapi.entityService.findOne("plugin::users-permissions.user", userId, {
            fields: ["id", "recently_played_musics"]
        })

        const newListeningHistory = [
            ...(currentListeningHistory["recently_played_musics"].filter(item => item.toString() !== musicId.toString()))
        ]

        const updateResult = await strapi.entityService.update("plugin::users-permissions.user", userId, {
            fields: ["id", "username", "recently_played_musics"],
            data: {
                recently_played_musics: newListeningHistory
            }
        })

        ctx.body = updateResult
    }
}