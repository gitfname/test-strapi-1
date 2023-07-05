'use strict';

/**
 * music-comment service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::music-comment.music-comment');
