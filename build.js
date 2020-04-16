#!/usr/bin/env node
'use strict';

var build = {
  consoleLog: false, // Set true for metalsmith file and meta content logging
  devMode: ((process.env.NODE_ENV || '').trim().toLowerCase() !== 'production'),
  pkg: require('./package.json')
}

var dir = {
  base: __dirname + '/',
  lib: __dirname + '/lib/',
  source: './src/',
  dest: './build/'
}

var siteMeta = {
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

var collectionsConfig = {
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
      layout: 'post.html'
    }
  }
}

var permalinksConfig = {
  pattern: ':mainCollection/:title'
}

var layoutConfig = {
  engine: 'handlebars',
  directory: dir.source + 'layouts/',
  partials: dir.source + 'layouts/partials/'
}

const metalsmith = require('metalsmith')
const markdown = require('metalsmith-markdown')
const publish = require('metalsmith-publish')
const collections = require('metalsmith-collections')
const permalinks = require('metalsmith-permalinks')
const inplace = require('metalsmith-in-place')
const layouts = require('metalsmith-layouts')
const sitemap = require('metalsmith-mapsite')
const rssfeed = require('metalsmith-feed')
const assets = require('metalsmith-assets')
const htmlmin = build.devMode ? null : require('metalsmith-html-minifier')
const browsersync = build.devMode ? require('metalsmith-browser-sync') : null
const setdate = require(dir.lib + 'metalsmith-setdate')
const moremeta = require(dir.lib + 'metalsmith-moremeta')
const debug = build.consoleLog ? require(dir.lib + 'metalsmith-debug') : null

var base = metalsmith(dir.base)
  .clean(true)
  .source(dir.source + 'html/')
  .destination(dir.dest)
  .metadata(siteMeta)
  .use(publish())
  .use(setdate())
  .use(collections(collectionsConfig))
  .use(markdown())
  .use(permalinks(permalinksConfig))
  .use(moremeta())
  .use(inplace(layoutConfig))
  .use(layouts(layoutConfig));

if (htmlmin) 
  base.use(htmlmin());

if (debug) 
  base.use(debug());

if (browsersync)
  base.use(browsersync({ 
    server: dir.dest,
    files: [dir.source + '**/*']
  }));

base
  .use(sitemap({
    hostname: siteMeta.domain + (siteMeta.rootpath || ''),
    omitIndex: true
  }))
  .use(rssfeed({
    collection: 'post',
    site_url: siteMeta.domain + (siteMeta.rootpath || ''),
    title: siteMeta.name,
    description: siteMeta.desc
  }))
  .use(assets({
    source: dir.source + 'assets/',
    destination: './'
  }))
  .build(function(err) {
    if (err)
      throw err;
    else
      console.log("Build successful")
      console.log((build.devMode ? 'Development' : 'Production'), 'build, version', build.pkg.version);
  });
