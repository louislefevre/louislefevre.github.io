#!/usr/bin/env node
'use strict';

const build = {
  consoleLog: false, // Set true for metalsmith file and meta content logging
  devMode: ((process.env.NODE_ENV || '').trim().toLowerCase() !== 'production'),
  pkg: require('./package.json')
}

const dir = {
  base: __dirname + '/',
  lib: __dirname + '/lib/',
  source: './src/',
  dest: './build/'
}

const siteMeta = {
  devBuild: build.devMode,
  version: build.pkg.version,
  name: 'Louis Lefevre',
  desc: 'Portfolio of projects by Louis Lefevre',
  author: 'Louis Lefevre',
  contact: 'louislefev@gmail.com',
  github: 'https://github.com/louislefevre',
  domain: build.devMode ? 'http://127.0.0.1' : 'http://louislefevre.github.io/',
  rootpath: build.devMode ? null : ''
}

const collectionsConfig = {
  page: {
    pattern: '**/index.md',
    sortBy: 'position',
    refer: false
  },
  post: {
    pattern: 'projects/*.md',
    sortBy: 'date',
    reverse: true,
    refer: true,
    metadata: {
      layout: 'post.hbs'
    }
  }
}

const permalinksConfig = {
  pattern: ':mainCollection/:title'
}

const partialsConfig = {
  directory: dir.source + 'layouts/partials/'
}

const layoutConfig = {
  engine: 'handlebars',
  directory: dir.source + 'layouts/',
}

const metalsmith = require('metalsmith')
const markdown = require('metalsmith-markdown')
const publish = require('metalsmith-publish')
const setDate = require(dir.lib + 'metalsmith-setdate')
const collections = require('metalsmith-collections')
const permalinks = require('@metalsmith/permalinks')
const moreMeta = require(dir.lib + 'metalsmith-moremeta')
const discoverPartials = require('metalsmith-discover-partials')
const inPlace = require('metalsmith-in-place')
const layouts = require('metalsmith-layouts')
const sitemap = require('metalsmith-mapsite')
const rssFeed = require('metalsmith-feed')
const assets = require('metalsmith-assets')
const debug = build.consoleLog ? require('metalsmith-debug') : null
const browserSync = build.devMode ? require('metalsmith-browser-sync') : null
const htmlMin = build.devMode ? null : require('metalsmith-html-minifier')

const base = metalsmith(dir.base)
  .clean(true)
  .source(dir.source + 'html/')
  .destination(dir.dest)
  .metadata(siteMeta)
  .use(publish(undefined))
  .use(setDate())
  .use(collections(collectionsConfig))
  .use(markdown(undefined))
  .use(permalinks(permalinksConfig))
  .use(moreMeta())
  .use(discoverPartials(partialsConfig))
  .use(inPlace(layoutConfig))
  .use(layouts(layoutConfig));

if (debug)
  base.use(debug());

if (browserSync)
  base.use(browserSync({
    server: dir.dest,
    files: [dir.source + '**/*']
  }));

if (htmlMin)
  base.use(htmlMin());

base
  .use(sitemap({
    hostname: siteMeta.domain + (siteMeta.rootpath || ''),
    omitIndex: true
  }))
  .use(rssFeed({
    collection: 'post',
    site_url: siteMeta.domain + (siteMeta.rootpath || ''),
    title: siteMeta.name,
    description: siteMeta.desc
  }))
  .use(assets({
    source: dir.source + 'assets/',
    destination: './'
  }))
  .build(function (err) {
    if (err) {
      console.log("Build failed")
      throw err
    } else {
      console.log("Build successful")
      console.log((build.devMode ? 'Development' : 'Production'), 'build, version', build.pkg.version)
    }
  });
