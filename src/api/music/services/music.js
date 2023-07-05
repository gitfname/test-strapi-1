'use strict';

/**
 * music service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::music.music');
