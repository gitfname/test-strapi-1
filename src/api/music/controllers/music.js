'use strict';

/**
 * music controller
 */

function random(min, max) {
    return Math.floor(Math.random() * ( max - min )) + min
}

const { createCoreController } = require('@strapi/strapi').factories;



module.exports = createCoreController('api::music.music',  ({strapi}) => ({
    async getTop10(ctx) {

        // START ---------------- get top 10 ---------------- START

        const musics = await strapi.entityService.findMany("api::music.music", {
            fields: ["id", "name"],
            populate: {
                likes: {
                    fields: ["id"],
                    filters: {
                        like: true
                    }
                },
                image: {
                    fields: ["id", "name", "url"]
                }
            }
        })

        let _topMusics = {}
        let topMusics = []

        musics.forEach(item => {
            if(item.id in _topMusics) {
                _topMusics[item.id] = {
                    ..._topMusics[item.id],
                    "likes": (_topMusics[item.id].likes + item.likes.length)
                }
            }
            else {
                _topMusics[item.id] = {
                    "id": item.id,
                    "name": item.name,
                    "image": item.image.url,
                    "likes": item.likes.length
                }
            }
        })

        Object.getOwnPropertyNames(_topMusics).forEach(key => {
            topMusics.push([key, _topMusics[key]])
        })

        ctx.body = topMusics.sort((item1, item2) => item2[1].likes - item1[1].likes).slice(0, 10)


        // const likes = await strapi.entityService.findMany("api::like.like", {
        //     fields: ["like"],
        //     populate: {
        //         music: {
        //             fields: ["id"]
        //         }
        //     }
        // })

        // const _musicIds = new Map(likes.map(like => [like.music.id, 0]))
        // const musicIds = [..._musicIds.keys()]
        // const musicsWithScores = []

        // const promises = musicIds.map(async musicId => {
        //     const res = await strapi.entityService.findMany("api::like.like", {
        //         fields: ["id"],
        //         start: 0,
        //         limit: 1000000,
        //         filters: {
        //             like: true,
        //             music: {
        //                 id: musicId
        //             }
        //         },
        //         populate: {
        //             music: {
        //                 fields: ["id", "name"]
        //             }
        //         }
        //     })
        //     musicsWithScores.push([musicId, res.length])
        // })

        // Promise.all(promises)
        //     .then(res => {
        //         musicsWithScores.sort((music1, music2) => music2[1] - music1[1])
        //         ctx.body = musicsWithScores.slice(0, 10).map(item => ({"music-id": item[0], "likes": item[1]}))
        //     })
        //     .catch(err => console.log(err))


        // END ---------------- get top 10 ---------------- END



        // function random(min, max) {
        //     return Math.floor(Math.random() * ( max - min )) + min
        // }

        // async function getMusicOwner(musicId) {
        //     const fetchOptions = {
        //         method: "post",
        //         headers: {
        //             "content-type": "application/json"
        //         },
        //         body: JSON.stringify({
        //             query: `
        //                 {
        //                     usersPermissionsUsers(
        //                         filters: {
        //                           musics: {
        //                             id: {eq: ${musicId}}
        //                           }
        //                         }
        //                       ) {
        //                         data {
        //                           id
        //                           attributes {
        //                             username
        //                           }
        //                         }
        //                     }
        //                 }
        //             `
        //         })
        //     }

        //     const res = await fetch("http://localhost:1337/graphql", fetchOptions)
        //     const data = await res.json()
        //     return data.data.usersPermissionsUsers.data[0]
        // }



        // const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


        // const getAssetsMusic_fetchOptions = {
        //     method: "post",
        //     headers: {
        //         "content-type": "application/json"
        //     },
        //     body: JSON.stringify({
        //         query: `
        //             {
        //                 uploadFiles (
        //                     pagination: {
        //                         page: 0,
        //                         pageSize: 1000
        //                     }
        //                     filters: {
        //                         mime: {eq: "audio/mpeg"}
        //                     }
        //                 ) {
        //                     data {
        //                         id
        //                         attributes {
        //                             name
        //                             mime
        //                         }
        //                     }
        //                 }
        //             }
        //         `
        //     })
        // }

        // const getAssetsImage_fetchOptions = {
        //     method: "post",
        //     headers: {
        //         "content-type": "application/json"
        //     },
        //     body: JSON.stringify({
        //         query: `
        //             {
        //                 uploadFiles (
        //                     pagination: {
        //                         page: 0,
        //                         pageSize: 1000
        //                     }
        //                     filters: {
        //                         mime: {eq: "image/jpeg"}
        //                     }
        //                 ) {
        //                     data {
        //                         id
        //                         attributes {
        //                             name
        //                             mime
        //                         }
        //                     }
        //                 }
        //             }
        //         `
        //     })
        // }

        // const getMusics_fetchOptions = {
        //     method: "post",
        //     headers: {
        //         "content-type": "application/json"
        //     },
        //     body: JSON.stringify({
        //         query: `
        //             {
        //                 musics (
        //                     pagination: {
        //                       page: 0
        //                       pageSize: 1000
        //                     }
        //                   ) {
        //                     data {
        //                       id
        //                       attributes {
        //                         name
        //                       }
        //                     }
        //                 }
        //             }
        //         `
        //     })
        // }

        // const getAssetsMusics  = fetch("http://localhost:1337/graphql", getAssetsMusic_fetchOptions).then(res => res.json()).then(data => data)
        // const getAssetsImages  = fetch("http://localhost:1337/graphql", getAssetsImage_fetchOptions).then(res => res.json()).then(data => data)
        // const getMusics  = fetch("http://localhost:1337/graphql", getMusics_fetchOptions).then(res => res.json()).then(data => data)

        // const users = await strapi.entityService.findMany("plugin::users-permissions.user", {
        //     fields: ["id", "username"]
        // })

        // function getRandomUser() {
        //     return users[random(0, users.length)]
        // }


        // create musics

        // await Promise.all([getAssetsMusics, getAssetsImages])
        //     .then(([musics, images]) => {

        //         musics.data.uploadFiles.data.forEach(async (music, i) => { 
        //             const res = await strapi.entityService.create("api::music.music", {
        //                 fields: ["name"],
        //                 data: {
        //                     name: `music - ${i + 100}`,
        //                     music: music.id,
        //                     image: images.data.uploadFiles.data[i].id
        //                 },
        //                 populate: ["music"]
        //             })
        //             console.log(res);
        //         })

        //     })
        //     .catch(err => console.log(err))



        // create likes and associate them with randomly selected musics

        // await Promise.all([getMusics])
        //     .then(async ([musics]) => {
        //         const musicsLength = musics.data.musics.data.length

        //         for(let i = 0; i<396; i++) {
        //             await strapi.entityService.create("api::like.like", {
        //                 data: {
        //                     like: random(0, 2) == 1 ? true : false,
        //                     music: musics.data.musics.data[random(0, musicsLength)].id,
        //                     users_permissions_user: users[random(0, users.length)].id
        //                 }
        //             })
        //         }
        //     })




        // create comments for musics

        // await Promise.all([getMusics])
        //     .then(async ([musics]) => {
        //         for(let i = 0; i<500; i++) {
        //             let selectedRandomMusic = musics.data.musics.data[random(0, musics.data.musics.data.length)]
        //             let selectedRandomUser = getRandomUser()

        //             await strapi.entityService.create("api::music-comment.music-comment", {
        //                 data: {
        //                     text: `comment from user ( ${ selectedRandomUser.username  } )  to music ( ${ selectedRandomMusic.attributes.name } )`,
        //                     music: selectedRandomMusic,
        //                     users_permissions_user: selectedRandomUser.id
        //                 }
        //             })
        //         }
        //     })



        // associate musics with users

        // await Promise.all([getMusics])
        //     .then(([musics]) => {
        //         musics.data.musics.data.forEach(async music => {
        //             await strapi.entityService.update("api::music.music", music.id, {
        //                 data: {
        //                     users_permissions_user: getRandomUser().id
        //                 }
        //             })
        //         })
        //     })
        //     .catch(err => console.log(err))



        // add lieks/dislikes for music comments
        
        // async function createCommentLike(value, userId, musicCommentId) {
        //     await strapi.entityService.create("api::comment-like.comment-like", {
        //         data: {
        //             like: value,
        //             music_comment: parseInt(musicCommentId),
        //             users_permissions_user: parseInt(userId)
        //         }
        //     })
        // }

        // const musicComments = await strapi.entityService.findMany("api::music-comment.music-comment", {
        //     fields: ["id"]
        // })

        // musicComments.forEach(async musicComment => {
        //     users.forEach(user => {
        //         createCommentLike(Boolean(random(0, 2)), user.id, musicComment.id)
        //     })
        // })

    },

    async getTop15Singers(ctx) {

        const res = await strapi.entityService.findMany("api::music.music", {
            fields: ["id", "name"],
            populate: {
                likes: {
                    fields: ["id", "like"],
                    filters: {
                        like: true
                    }
                },
                users_permissions_user: {
                    fields: ["id" ,"username"],
                    populate: {
                        image: {
                            fields: ["id", "name", "url"]
                        }
                    }
                }
            }
        })

        let _topusers = {}
        let topusers = []

        res.forEach(item => {
            if(item.users_permissions_user.id in _topusers) {
                _topusers[item.users_permissions_user.id] = {
                    ..._topusers[item.users_permissions_user.id],
                    "likes":(_topusers[item.users_permissions_user.id].likes + item.likes.length)
                }
            }
            else {
                _topusers[item.users_permissions_user.id] = {
                    "username": item.users_permissions_user.username,
                    "image": item.users_permissions_user.image.url,
                    "image-name": item.users_permissions_user.image.name,
                    "likes": item.likes.length
                }
            }
        })

        Object.getOwnPropertyNames(_topusers).forEach(key => {
            topusers.push([key, _topusers[key]])
        })

        ctx.body = topusers.sort((item1, item2) => item2[1].likes - item1[1].likes ).slice(0, 15)



        // const likes = await strapi.entityService.findMany("api::like.like", {
        //     fields: ["like"],
        //     populate: {
        //         music: {
        //             fields: ["id"]
        //         }
        //     }
        // })

        // const _musicIds = new Map(likes.map(like => [like.music.id, 0]))
        // const musicIds = [..._musicIds.keys()]
        // const musicsWithScores = []

        // const promises = musicIds.map(musicId => {
        //     return strapi.entityService.findMany("api::like.like", {
        //         fields: ["id"],
        //         start: 0,
        //         limit: 1000000,
        //         filters: {
        //             like: true,
        //             music: {
        //                 id: musicId
        //             }
        //         },
        //         populate: {
        //             music: {
        //                 fields: ["id", "name"]
        //             }
        //         }
        //     })
        //     .then(res => {
        //         musicsWithScores.push([musicId, res.length])
        //     })
        // })

        // await Promise.all(promises)
        //     .then(async res => {
        //         musicsWithScores.sort((music1, music2) => music2[1] - music1[1])
        //         const topMusics = musicsWithScores
        //         const top15SingersPromises = topMusics.map(music => {
        //             return strapi.entityService.findOne("api::music.music", music[0], {
        //                 fields: ["id"],
        //                 populate: {
        //                     users_permissions_user: {
        //                         fields: ["id", "username"],
        //                         populate: {
        //                             image: {
        //                                 fields: ["name", "url", "width", "height"]
        //                             }
        //                         }
        //                     }
        //                 }
        //             })
        //         })
        //         await Promise.all(top15SingersPromises)
        //         .then(res => {
        //             ctx.body = res
        //         })
        //     })
        //     .catch(err => console.log(err))

    },

    async getTop7UpcomingMusics(ctx) {

        const upcomingMusics = await strapi.entityService.findMany("api::upcomming-music.upcomming-music", {
            fields: ["id", "name"],
            populate: {
                upcomming_music_likes : {
                    fields: ["id"],
                    filters: {
                        like: true
                    }
                },
                users_permissions_user: {
                    fields: ["id" ,"username"],
                    populate: {
                        image: {
                            fields: ["id", "name", "url"]
                        }
                    }
                },
                poster_image: {
                    fields: ["id", "name", "url"]
                },
                video: {
                    fields: ["id", "name", "url", "size"]
                }
            }
        })

        let _topUpcomingMusics = {}
        let topUpcomingMusics = []

        upcomingMusics.forEach(item => {
            if(item.id in _topUpcomingMusics) {
                _topUpcomingMusics[item.id] = {
                    ..._topUpcomingMusics[item.id],
                    "likes":(_topUpcomingMusics[item.id].likes + item.upcomming_music_likes.length)
                }
            }
            else {
                _topUpcomingMusics[item.id] = {
                    "singer-details": {
                        "id": item.users_permissions_user.id,
                        "username": item.users_permissions_user.username,
                        "image": item.users_permissions_user.image.url,
                        "image-name": item.users_permissions_user.image.name,
                    },
                    "music-details": {
                        "name": item.name,
                        "poster-image": {
                            "id": item.poster_image.id,
                            "name": item.poster_image.name,
                            "url": item.poster_image.url
                        },
                        "video": {
                            "id": item.video.id,
                            "name": item.video.name,
                            "url": item.video.url,
                            "size": item.video.size
                        }
                    },
                    "likes": item.upcomming_music_likes.length
                }
            }
        })

        Object.getOwnPropertyNames(_topUpcomingMusics).forEach(key => {
            topUpcomingMusics.push([key, _topUpcomingMusics[key]])
        })

        ctx.body = topUpcomingMusics.sort((item1, item2) => item2[1].likes - item1[1].likes ).slice(0, 7)



        // const upcomingMusics = await strapi.entityService.findMany("api::upcomming-music.upcomming-music", {
        //     fields: ["id"]
        // })

        // const users = await strapi.entityService.findMany("plugin::users-permissions.user", {
        //     fields: ["id"]
        // })

        // async function createUpcomingMusicLike(value, userId, upcomingMusicId) {
        //     await strapi.entityService.create("api::upcomming-music-like.upcomming-music-like", {
        //         data: {
        //             like: value,
        //             users_permissions_user: userId,
        //             upcomming_music: upcomingMusicId
        //         }
        //     })
        // }

        // let test = 0

        // upcomingMusics.forEach(upcomingMusic => {
        //     users.forEach(async user => {
        //         if(random(0, 4)) {
        //             await createUpcomingMusicLike(Boolean(random(0, 2)), user.id, upcomingMusic.id)
        //         }
        //     })
        //     test++
        // })

        // ctx.body = test
    }
}));
