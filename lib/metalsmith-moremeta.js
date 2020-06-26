/*
 * Metalsmith More-meta
 * Adds further meta information to metalsmith files:
 * root						- The absolute or relative website root folder
 * layout					- Sets from default from collection
 * isPage					- Is an index page
 * mainCollection	- The primary collection name
 * header					- Array of main navigation pages
 * navsub					- Array of secondary navigation pages
 */
module.exports = function()
{
  'use strict';

  return function(files, metalsmith, done)
  {
    var meta = metalsmith.metadata();
    var file, f, page, p, c, thisCol, layout;

    for (f in files)
    {
      file = files[f];
      file.root = file.root || meta.rootpath || (file.path ? '../'.repeat(file.path.split('/').length) : '');
      file.mainCollection = null;
      file.isPage = false;
      file.header = [];
      c = 0;
      
      while (c < file.collection.length)
      {
        if (file.collection[c] === 'page')
          file.isPage = true;
        else 
          file.mainCollection = file.mainCollection || file.collection[c];
        c++;
      }

      for (p = 0; p < meta.collections.page.length; p++)
      {
        page = meta.collections.page[p];
        if (!p || page.path !== meta.collections.page[p-1].path)
        {
          file.header.push({
            title:				page.title || '',
            description:	page.description || '',
            path:					file.root + page.path + (page.path ? '/' : ''),
            dateFormat:		page.dateFormat,
            active:				page.path == file.path || page.collection.indexOf(file.mainCollection) >= 0,
            language:     page.language || ''
          });
        }
      }

      if (file.mainCollection)
      {
        thisCol = meta.collections[file.mainCollection];
        layout = file.layout || (thisCol.metadata && thisCol.metadata.layout) || null;
        file.navsub = [];
        
        if (layout) 
          file.layout = layout;

        for (p = 0; p < thisCol.length; p++)
        {
          page = thisCol[p];
          if (page.collection.indexOf('page') < 0 && (!p || page.path !== thisCol[p-1].path))
          {
            file.navsub.push({
              title:				page.title || '',
              description:	page.description || '',
              path:					file.root + page.path + (page.path ? '/' : ''),
              dateFormat:		page.dateFormat,
              active:				page.path === file.path,
              language:     page.language || ''
            });
          }
        }
      }
    }
    
    done();
  };
};
